<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormTemplate extends Model
{
    use HasFactory;

    protected $table = 'form_templates';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'description',
        'department_id',
        'published',
        'prerequisite_form_id',
        'approval_flow',
    ];

    protected $casts = [
        'published' => 'boolean',
        'approval_flow' => 'array',
    ];

    public function fields()
    {
        return $this->hasMany(FormField::class, 'template_id', 'id')->orderBy('sort_order');
    }
}
