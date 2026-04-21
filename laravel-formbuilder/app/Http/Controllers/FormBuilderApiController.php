<?php

namespace App\Http\Controllers;

use App\Models\FormDepartment;
use App\Models\FormField;
use App\Models\FormSubmission;
use App\Models\FormTemplate;
use App\Models\FormUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class FormBuilderApiController extends Controller
{
    public function bootstrap()
    {
        return response()->json([
            'users' => FormUser::query()->orderBy('id')->get()->map(function (FormUser $user) {
                return [
                    'id' => $user->id,
                    'username' => $user->username,
                    'password' => $user->password,
                    'role' => $user->role,
                    'name' => $user->name,
                    'email' => $user->email,
                    'department' => $user->department_id,
                ];
            }),
            'depts' => FormDepartment::query()->orderBy('name')->get()->map(function (FormDepartment $dept) {
                return [
                    'id' => $dept->id,
                    'name' => $dept->name,
                    'code' => $dept->code,
                ];
            }),
            'templates' => FormTemplate::query()->with('fields')->orderBy('created_at')->get()->map(fn (FormTemplate $t) => $this->mapTemplate($t)),
            'submissions' => FormSubmission::query()->orderByDesc('submitted_at')->orderByDesc('created_at')->get()->map(fn (FormSubmission $s) => $this->mapSubmission($s)),
        ]);
    }

    public function saveTemplate(Request $request)
    {
        $payload = $request->validate([
            'id' => ['required', 'string', 'max:100'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'department' => ['nullable', 'string', Rule::exists('form_departments', 'id')],
            'published' => ['nullable', 'boolean'],
            'prerequisiteFormId' => ['nullable', 'string'],
            'approvalFlow' => ['nullable', 'array'],
            'approvalFlow.*.id' => ['nullable', 'string', 'max:100'],
            'approvalFlow.*.name' => ['nullable', 'string', 'max:255'],
            'approvalFlow.*.email' => ['nullable', 'string', 'max:255'],
            'approvalFlow.*.title' => ['nullable', 'string', 'max:255'],
            'fields' => ['nullable', 'array'],
            'fields.*.id' => ['required', 'string', 'max:100'],
            'fields.*.type' => ['required', 'string', 'max:50'],
            'fields.*.label' => ['nullable', 'string', 'max:255'],
            'fields.*.required' => ['nullable', 'boolean'],
            'fields.*.options' => ['nullable', 'array'],
            'fields.*.formula' => ['nullable', 'string'],
            'fields.*.tableColumns' => ['nullable', 'array'],
        ]);

        DB::transaction(function () use ($payload) {
            $template = FormTemplate::query()->firstOrNew(['id' => $payload['id']]);
            $template->name = $payload['name'];
            $template->description = $payload['description'] ?? null;
            $template->department_id = $payload['department'] ?? null;
            $template->published = (bool) ($payload['published'] ?? false);
            $template->prerequisite_form_id = $payload['prerequisiteFormId'] ?? null;
            $template->approval_flow = $payload['approvalFlow'] ?? [];
            $template->save();

            FormField::query()->where('template_id', $template->id)->delete();

            $fields = $payload['fields'] ?? [];
            foreach ($fields as $index => $field) {
                FormField::query()->create([
                    'id' => $field['id'],
                    'template_id' => $template->id,
                    'type' => $field['type'],
                    'label' => $field['label'] ?? null,
                    'required' => (bool) ($field['required'] ?? false),
                    'options' => $field['options'] ?? null,
                    'formula' => $field['formula'] ?? null,
                    'table_columns' => $field['tableColumns'] ?? null,
                    'sort_order' => $index,
                ]);
            }
        });

        $saved = FormTemplate::query()->with('fields')->findOrFail($payload['id']);
        return response()->json([
            'ok' => true,
            'template' => $this->mapTemplate($saved),
        ]);
    }

    public function toggleTemplatePublish(string $id)
    {
        $template = FormTemplate::query()->findOrFail($id);
        $template->published = !$template->published;
        $template->save();

        return response()->json([
            'ok' => true,
            'published' => $template->published,
        ]);
    }

    public function deleteTemplate(string $id)
    {
        $template = FormTemplate::query()->findOrFail($id);
        $template->delete();

        return response()->json(['ok' => true]);
    }

    public function storeSubmission(Request $request)
    {
        $payload = $request->validate([
            'id' => ['required', 'string', 'max:100'],
            'templateId' => ['nullable', 'string'],
            'templateName' => ['required', 'string', 'max:255'],
            'department' => ['nullable', 'string'],
            'employeeName' => ['required', 'string', 'max:255'],
            'employeeEmail' => ['required', 'email', 'max:255'],
            'data' => ['nullable', 'array'],
            'approvalSteps' => ['nullable', 'array'],
            'status' => ['required', 'string', 'max:50'],
            'submittedAt' => ['nullable', 'date'],
        ]);

        $submission = FormSubmission::query()->create([
            'id' => $payload['id'],
            'template_id' => $payload['templateId'] ?? null,
            'template_name' => $payload['templateName'],
            'department_id' => $payload['department'] ?? null,
            'employee_name' => $payload['employeeName'],
            'employee_email' => $payload['employeeEmail'],
            'data' => $payload['data'] ?? [],
            'approval_steps' => $payload['approvalSteps'] ?? [],
            'status' => $payload['status'],
            'submitted_at' => $payload['submittedAt'] ?? now(),
        ]);

        return response()->json([
            'ok' => true,
            'submission' => $this->mapSubmission($submission),
        ]);
    }

    public function showSubmission(string $id)
    {
        $submission = FormSubmission::query()->find($id);
        if (!$submission) {
            return response()->json(['ok' => false, 'message' => 'Submission not found'], 404);
        }

        return response()->json([
            'ok' => true,
            'submission' => $this->mapSubmission($submission),
        ]);
    }

    private function mapTemplate(FormTemplate $template): array
    {
        return [
            'id' => $template->id,
            'name' => $template->name,
            'description' => $template->description,
            'department' => $template->department_id,
            'published' => (bool) $template->published,
            'prerequisiteFormId' => $template->prerequisite_form_id,
            'approvalFlow' => $template->approval_flow ?? [],
            'fields' => $template->fields->sortBy('sort_order')->values()->map(function (FormField $field) {
                return [
                    'id' => $field->id,
                    'type' => $field->type,
                    'label' => $field->label,
                    'required' => (bool) $field->required,
                    'options' => $field->options,
                    'formula' => $field->formula,
                    'tableColumns' => $field->table_columns,
                ];
            })->all(),
        ];
    }

    private function mapSubmission(FormSubmission $submission): array
    {
        return [
            'id' => $submission->id,
            'templateId' => $submission->template_id,
            'templateName' => $submission->template_name,
            'department' => $submission->department_id,
            'employeeName' => $submission->employee_name,
            'employeeEmail' => $submission->employee_email,
            'data' => $submission->data ?? [],
            'approvalSteps' => $submission->approval_steps ?? [],
            'status' => $submission->status,
            'submittedAt' => optional($submission->submitted_at)->toISOString() ?? optional($submission->created_at)->toISOString(),
        ];
    }
}
