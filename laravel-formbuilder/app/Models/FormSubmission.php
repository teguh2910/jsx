<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormSubmission extends Model
{
    use HasFactory;

    protected $table = 'form_submissions';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'template_id',
        'template_name',
        'department_id',
        'employee_name',
        'employee_email',
        'data',
        'approval_steps',
        'status',
        'submitted_at',
    ];

    protected $casts = [
        'data' => 'array',
        'approval_steps' => 'array',
        'submitted_at' => 'datetime',
    ];
}
