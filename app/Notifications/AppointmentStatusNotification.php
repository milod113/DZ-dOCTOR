<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue; // Required for queuing
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Queue\SerializesModels; // Required to save model IDs to queue, not full objects

class AppointmentStatusNotification extends Notification implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $appointment;
    public $status;

    public function __construct($appointment, $status)
    {
        $this->appointment = $appointment;
        $this->status = $status;
    }

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'appointment_id' => $this->appointment->id,
            'message' => $this->getMessage(),
            'url' => route('dashboard'),
            'type' => 'status_update'
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'id' => $this->id,
            'message' => $this->getMessage(),
            'url' => route('dashboard'),
            'created_at' => now()->diffForHumans(),
        ]);
    }

    private function getMessage()
    {
        // When queued, relations might not be loaded automatically.
        // We assume $this->appointment is re-fetched by SerializesModels,
        // but we should ensure we access the relation safely.
        $doctorName = "Dr. " . ($this->appointment->doctorProfile->last_name ?? 'Doctor');

        return match ($this->status) {
            'confirmed' => "Good news! {$doctorName} confirmed your appointment.",
            'cancelled' => "Appointment cancelled by {$doctorName}.",
            'rejected'  => "Your appointment request was rejected by {$doctorName}.",
            'completed' => "Your appointment with {$doctorName} is marked as completed.",
            'no_show'   => "You were marked as a 'No Show' for your appointment with {$doctorName}.",
            default     => "Update regarding your appointment with {$doctorName}."
        };
    }
}
