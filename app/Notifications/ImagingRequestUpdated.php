<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast; // ✅ Required for Real-Time
use Illuminate\Notifications\Messages\BroadcastMessage; // ✅ Required for Real-Time
use App\Models\ImagingRequest;

class ImagingRequestUpdated extends Notification implements ShouldQueue, ShouldBroadcast
{
    use Queueable;

    public $request;
    public $action; // 'confirm', 'reject', 'reschedule', 'complete'

    public function __construct(ImagingRequest $request, string $action)
    {
        $this->request = $request;
        $this->action = $action;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable)
    {
        // ✅ Add 'broadcast' to the array
        return ['mail', 'database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
 public function toMail($notifiable)
    {
        // 1. Prepare Data
        $patientName = $this->request->is_walkin
            ? $this->request->guest_name
            : ($this->request->user ? $this->request->user->name : 'Patient');

        $date = \Carbon\Carbon::parse($this->request->requested_date)
            ->locale('fr')
            ->isoFormat('dddd D MMMM YYYY à HH:mm');

        $centerName = $this->request->center->name ?? "Centre d'Imagerie";
        $examName = $this->request->exam->name ?? "Examen";

        // Determine subject based on action
        $subjects = [
            'confirm' => 'Confirmation de votre rendez-vous',
            'reschedule' => 'Nouveau créneau pour votre rendez-vous',
            'reject' => 'Mise à jour concernant votre demande',
            'complete' => 'Votre examen est terminé',
        ];

        $subject = $subjects[$this->action] ?? 'Mise à jour de votre rendez-vous';

        // 2. Return the View
        return (new MailMessage)
            ->subject($subject . ' - DzDoctor')
            ->view('emails.appointment_updated', [
                'patientName' => $patientName,
                'centerName' => $centerName,
                'examName' => $examName,
                'date' => $date,
                'action' => $this->action, // 'confirm', 'reject', 'reschedule'
                'reason' => $this->request->rejection_reason ?? $this->request->notes,
                'isWalkin' => $this->request->is_walkin
            ]);
    }

    /**
     * Get the array representation of the notification (Database).
     */
    public function toArray($notifiable)
    {
        return $this->formatNotificationData();
    }

    /**
     * Get the broadcast representation of the notification (Real-Time).
     */
    public function toBroadcast($notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            // This data is sent immediately to the frontend via WebSocket
            'data' => $this->formatNotificationData(),
            'read_at' => null,
            'created_at' => now()->toIso8601String(),
            'id' => $this->id,
            'type' => static::class,
        ]);
    }

    /**
     * Helper to format data consistently for DB and Broadcast.
     */
    private function formatNotificationData()
    {
        $centerName = $this->request->center->name;

        $message = match($this->action) {
            'confirm' => "Rendez-vous confirmé chez {$centerName}",
            'reschedule' => "Nouvelle date proposée par {$centerName}",
            'reject' => "Demande refusée par {$centerName}",
            'complete' => "Examen terminé chez {$centerName}",
            default => "Mise à jour de votre demande"
        };

        return [
            'request_id' => $this->request->id,
            'status' => $this->request->status,
            'message' => $message,
            'action' => $this->action, // Useful for frontend icons
            'link' => '/my-health/imaging-requests' // Link to click
        ];
    }
}
