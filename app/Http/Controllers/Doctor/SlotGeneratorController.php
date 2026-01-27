<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Slot;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SlotGeneratorController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date|after_or_equal:today',
            'end_date'   => 'required|date|after_or_equal:start_date', // Plage de dates
            'days'       => 'required|array', // Ex: [0, 1, 2, 3, 4] pour Dim-Jeu
            'start_time' => 'required|date_format:H:i',
            'end_time'   => 'required|date_format:H:i|after:start_time',
            'duration'   => 'required|integer|min:10|max:120',
            'clinic_id'  => 'required|exists:clinics,id',
        ]);

        $doctor = $request->user()->doctorProfile;

        // 1. Initialiser les dates
        $currentDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        $duration = $request->duration;
        $createdCount = 0;

        DB::transaction(function () use ($doctor, $request, $currentDate, $endDate, $duration, &$createdCount) {

            // BOUCLE 1 : Les Jours (Du 1er au 30 du mois)
            while ($currentDate->lte($endDate)) {

                // Vérifier si ce jour est coché par le médecin (Ex: est-ce un Dimanche ?)
                // Carbon: 0=Dimanche, 1=Lundi, ... 6=Samedi
                if (in_array($currentDate->dayOfWeek, $request->days)) {

                    // Préparer les heures pour CE jour spécifique
                    $slotTime = Carbon::parse($currentDate->format('Y-m-d') . ' ' . $request->start_time);
                    $dayEndTime = Carbon::parse($currentDate->format('Y-m-d') . ' ' . $request->end_time);

                    // BOUCLE 2 : Les Heures (08:00 -> 17:00)
                    while ($slotTime->copy()->addMinutes($duration)->lte($dayEndTime)) {

                        $slotEnd = $slotTime->copy()->addMinutes($duration);

                        // Vérifier doublon
                        $exists = Slot::where('doctor_profile_id', $doctor->id)
                            ->where('start_at', $slotTime)
                            ->exists();

                        if (!$exists) {
                            Slot::create([
                                'doctor_profile_id' => $doctor->id,
                                'clinic_id' => $request->clinic_id,
                                'start_at' => $slotTime,
                                'end_at' => $slotEnd,
                                'status' => 'available',
                            ]);
                            $createdCount++;
                        }

                        // Avancer à la prochaine heure
                        $slotTime->addMinutes($duration);
                    }
                }

                // Avancer au jour suivant
                $currentDate->addDay();
            }
        });

        return back()->with('success', "$createdCount créneaux générés avec succès !");
    }

    // Méthode pour supprimer un créneau (Empêchement / Erreur)
    public function destroy(Slot $slot)
    {
        // Sécurité : seul le propriétaire peut supprimer
        if ($slot->doctor_profile_id !== auth()->user()->doctorProfile->id) {
            abort(403);
        }

        // Si le créneau est déjà réservé, on ne peut pas le supprimer "simplement"
        // Il faut d'abord annuler le RDV (logique gérée ailleurs).
        if ($slot->status === 'booked') {
            return back()->with('error', "Impossible de supprimer un créneau réservé. Annulez le rendez-vous d'abord.");
        }

        $slot->delete();

        return back()->with('success', "Créneau supprimé.");
    }

    // Méthode pour supprimer une journée entière (ex: Jour Férié imprévu)
    public function destroyDay(Request $request)
    {
        $date = $request->date; // '2026-01-22'

        $count = Slot::where('doctor_profile_id', auth()->user()->doctorProfile->id)
            ->whereDate('start_at', $date)
            ->where('status', 'available') // On ne supprime que les libres
            ->delete();

        return back()->with('success', "$count créneaux libres supprimés pour le $date.");
    }




}
