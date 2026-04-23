<?php

namespace Tests\Unit;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Mockery;
use PHPUnit\Framework\Attributes\PreserveGlobalState;
use PHPUnit\Framework\Attributes\RunTestsInSeparateProcesses;
use SatuForm\FormBuilder\Http\Controllers\FormBuilderApiController;
use Tests\TestCase;

#[RunTestsInSeparateProcesses]
#[PreserveGlobalState(false)]
class FormBuilderApiControllerTest extends TestCase
{
    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_bootstrap_returns_expected_payload_shape(): void
    {
        $formDepartment = Mockery::mock('alias:SatuForm\FormBuilder\Models\FormDepartment');
        $formTemplate = Mockery::mock('alias:SatuForm\FormBuilder\Models\FormTemplate');
        $formSubmission = Mockery::mock('alias:SatuForm\FormBuilder\Models\FormSubmission');

        $deptQuery = Mockery::mock();
        $templateQuery = Mockery::mock();
        $submissionQuery = Mockery::mock();

        $formDepartment->shouldReceive('query')->once()->andReturn($deptQuery);
        $deptQuery->shouldReceive('orderBy')->once()->with('name')->andReturnSelf();
        $deptQuery->shouldReceive('get')->once()->andReturn(collect());

        $formTemplate->shouldReceive('query')->once()->andReturn($templateQuery);
        $templateQuery->shouldReceive('with')->once()->with('fields')->andReturnSelf();
        $templateQuery->shouldReceive('orderBy')->once()->with('created_at')->andReturnSelf();
        $templateQuery->shouldReceive('get')->once()->andReturn(collect());

        $formSubmission->shouldReceive('query')->once()->andReturn($submissionQuery);
        $submissionQuery->shouldReceive('orderByDesc')->once()->with('submitted_at')->andReturnSelf();
        $submissionQuery->shouldReceive('orderByDesc')->once()->with('created_at')->andReturnSelf();
        $submissionQuery->shouldReceive('get')->once()->andReturn(collect());

        $response = (new FormBuilderApiController())->bootstrap();
        $payload = $response->getData(true);

        $this->assertSame([], $payload['users']);
        $this->assertSame([], $payload['depts']);
        $this->assertSame([], $payload['templates']);
        $this->assertSame([], $payload['submissions']);
    }

    public function test_save_user_requires_password_for_new_user(): void
    {
        $request = Mockery::mock(Request::class);
        $request->shouldReceive('input')->once()->with('id')->andReturn(null);
        $request->shouldReceive('validate')->once()->andReturn([
            'username' => 'new.user',
            'role' => 'manager',
            'name' => 'New User',
            'email' => 'new@company.com',
            'department' => 'dep-1',
        ]);

        $response = (new FormBuilderApiController())->saveUser($request);

        $this->assertSame(422, $response->status());
        $payload = $response->getData(true);
        $this->assertSame('Password is required for new user.', $payload['message']);
    }

    public function test_save_user_requires_department_for_non_superadmin(): void
    {
        $request = Mockery::mock(Request::class);
        $request->shouldReceive('input')->once()->with('id')->andReturn(7);
        $request->shouldReceive('validate')->once()->andReturn([
            'id' => 7,
            'username' => 'updated.user',
            'password' => null,
            'role' => 'manager',
            'name' => 'Updated User',
            'email' => 'updated@example.com',
            'department' => null,
        ]);

        $response = (new FormBuilderApiController())->saveUser($request);
        $payload = $response->getData(true);

        $this->assertSame(422, $response->status());
        $this->assertSame('Department is required for non-superadmin user.', $payload['message']);
    }

    public function test_delete_user_rejects_superadmin(): void
    {
        $formUser = Mockery::mock('alias:SatuForm\FormBuilder\Models\FormUser');
        $query = Mockery::mock();
        $user = new FakeRecord(['role' => 'superadmin']);

        $formUser->shouldReceive('query')->once()->andReturn($query);
        $query->shouldReceive('findOrFail')->once()->with(10)->andReturn($user);

        $response = (new FormBuilderApiController())->deleteUser(10);
        $payload = $response->getData(true);

        $this->assertSame(422, $response->status());
        $this->assertSame('Superadmin user cannot be deleted.', $payload['message']);
    }

    public function test_save_template_bubbles_up_transaction_error(): void
    {
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('forced transaction error');

        DB::shouldReceive('transaction')
            ->once()
            ->andThrow(new \RuntimeException('forced transaction error'));

        $request = Mockery::mock(Request::class);
        $request->shouldReceive('validate')->once()->andReturn([
            'id' => 'TPL-UNIT',
            'name' => 'Unit Test Template',
            'description' => null,
            'department' => null,
            'published' => false,
            'prerequisiteFormId' => null,
            'approvalFlow' => [],
            'fields' => [],
        ]);

        (new FormBuilderApiController())->saveTemplate($request);
    }

    public function test_toggle_template_publish_toggles_state(): void
    {
        $formTemplate = Mockery::mock('alias:SatuForm\FormBuilder\Models\FormTemplate');
        $query = Mockery::mock();
        $template = new FakeRecord(['published' => false]);

        $formTemplate->shouldReceive('query')->once()->andReturn($query);
        $query->shouldReceive('findOrFail')->once()->with('TPL-1')->andReturn($template);

        $response = (new FormBuilderApiController())->toggleTemplatePublish('TPL-1');
        $payload = $response->getData(true);

        $this->assertTrue($payload['ok']);
        $this->assertTrue($payload['published']);
        $this->assertTrue($template->saved);
    }

    public function test_delete_template_deletes_and_returns_ok(): void
    {
        $formTemplate = Mockery::mock('alias:SatuForm\FormBuilder\Models\FormTemplate');
        $query = Mockery::mock();
        $template = new FakeRecord();

        $formTemplate->shouldReceive('query')->once()->andReturn($query);
        $query->shouldReceive('findOrFail')->once()->with('TPL-2')->andReturn($template);

        $response = (new FormBuilderApiController())->deleteTemplate('TPL-2');
        $payload = $response->getData(true);

        $this->assertTrue($payload['ok']);
        $this->assertTrue($template->deleted);
    }

    public function test_store_submission_returns_error_when_template_missing(): void
    {
        $formTemplate = Mockery::mock('alias:SatuForm\FormBuilder\Models\FormTemplate');
        $query = Mockery::mock();

        $formTemplate->shouldReceive('query')->once()->andReturn($query);
        $query->shouldReceive('find')->once()->with('TPL-MISS')->andReturn(null);

        $request = Mockery::mock(Request::class);
        $request->shouldReceive('validate')->once()->andReturn([
            'id' => 'SUB-1',
            'templateId' => 'TPL-MISS',
            'templateName' => 'Missing Template',
            'department' => null,
            'employeeName' => 'Tester',
            'employeeEmail' => 'tester@example.com',
            'data' => [],
            'status' => 'pending',
        ]);

        $response = (new FormBuilderApiController())->storeSubmission($request);
        $payload = $response->getData(true);

        $this->assertSame(422, $response->status());
        $this->assertSame('Template not found.', $payload['message']);
    }

    public function test_show_submission_returns_404_when_not_found(): void
    {
        $formSubmission = Mockery::mock('alias:SatuForm\FormBuilder\Models\FormSubmission');
        $query = Mockery::mock();

        $formSubmission->shouldReceive('query')->once()->andReturn($query);
        $query->shouldReceive('find')->once()->with('SUB-404')->andReturn(null);

        $response = (new FormBuilderApiController())->showSubmission('SUB-404');
        $payload = $response->getData(true);

        $this->assertSame(404, $response->status());
        $this->assertFalse($payload['ok']);
        $this->assertSame('Submission not found', $payload['message']);
    }

    public function test_review_submission_returns_error_when_no_active_step(): void
    {
        $formSubmission = Mockery::mock('alias:SatuForm\FormBuilder\Models\FormSubmission');
        $query = Mockery::mock();
        $submission = new FakeRecord([
            'approval_steps' => [
                ['status' => 'pending', 'role' => 'manager'],
            ],
        ]);

        $formSubmission->shouldReceive('query')->once()->andReturn($query);
        $query->shouldReceive('findOrFail')->once()->with('SUB-REV')->andReturn($submission);

        $request = Mockery::mock(Request::class);
        $request->shouldReceive('validate')->once()->andReturn([
            'action' => 'approved',
            'reviewerRole' => 'manager',
            'reviewerUsername' => 'mgr1',
            'reviewerName' => 'Manager One',
            'comments' => '',
        ]);

        $response = (new FormBuilderApiController())->reviewSubmission($request, 'SUB-REV');
        $payload = $response->getData(true);

        $this->assertSame(422, $response->status());
        $this->assertSame('No active approval step found.', $payload['message']);
    }
}

class FakeRecord
{
    public bool $saved = false;
    public bool $deleted = false;

    public function __construct(array $attributes = [])
    {
        foreach ($attributes as $key => $value) {
            $this->{$key} = $value;
        }
    }

    public function save(): bool
    {
        $this->saved = true;
        return true;
    }

    public function delete(): bool
    {
        $this->deleted = true;
        return true;
    }

    public function fresh(): static
    {
        return $this;
    }
}
