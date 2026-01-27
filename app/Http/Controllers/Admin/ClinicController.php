<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Clinic;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ClinicController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Clinics/Index', [
            'clinics' => Clinic::orderBy('name')->paginate(10),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Clinics/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required','string','max:255'],
            'slug' => ['nullable','string','max:255','unique:clinics,slug'],
            'address' => ['required','string','max:255'],
            'city' => ['required','string','max:100'],
            'phone' => ['nullable','string','max:50'],
            'is_active' => ['boolean'],
        ]);

        $data['slug'] = $data['slug'] ?: Str::slug($data['name']);

        Clinic::create($data);

        return redirect()->route('admin.clinics.index')->with('success', __('ui.saved'));
    }

    public function edit(Clinic $clinic)
    {
        return Inertia::render('Admin/Clinics/Edit', [
            'clinic' => $clinic,
        ]);
    }

    public function update(Request $request, Clinic $clinic)
    {
        $data = $request->validate([
            'name' => ['required','string','max:255'],
            'slug' => ['required','string','max:255','unique:clinics,slug,'.$clinic->id],
            'address' => ['required','string','max:255'],
            'city' => ['required','string','max:100'],
            'phone' => ['nullable','string','max:50'],
            'is_active' => ['boolean'],
        ]);

        $clinic->update($data);

        return redirect()->route('admin.clinics.index')->with('success', __('ui.saved'));
    }

    public function destroy(Clinic $clinic)
    {
        $clinic->delete();
        return redirect()->route('admin.clinics.index')->with('success', __('ui.saved'));
    }
}
