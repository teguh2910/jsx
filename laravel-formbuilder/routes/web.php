<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FormBuilderApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('formbuilder');
});

Route::get('/dashboard', function () {
    return view('formbuilder');
})->name('dashboard');

Route::prefix('formbuilder/api')->group(function () {
    Route::get('/bootstrap', [FormBuilderApiController::class, 'bootstrap']);
    Route::get('/submissions/{id}', [FormBuilderApiController::class, 'showSubmission']);
    Route::post('/submissions', [FormBuilderApiController::class, 'storeSubmission']);
    Route::post('/templates', [FormBuilderApiController::class, 'saveTemplate']);
    Route::post('/templates/{id}/toggle-publish', [FormBuilderApiController::class, 'toggleTemplatePublish']);
    Route::delete('/templates/{id}', [FormBuilderApiController::class, 'deleteTemplate']);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
