<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

// IMPORANT: Implement ShouldQueue for performance
class NewAppointmentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $appointment;
    public $message;

    public function __construct($appointment, $message)
    {
        $this->appointment = $appointment;
        $this->message = $message;
    }

    // 1. Send via Database AND Broadcast
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    // 2. Format for Database
    public function toArray(object $notifiable): array
    {
        return [
            'appointment_id' => $this->appointment->id,
            'message' => $this->message,
            'url' => route('doctor.appointments.index'), // Dynamic based on role logic if needed
            'type' => 'appointment'
        ];
    }

    // 3. Format for Real-Time (Reverb)
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'id' => $this->id, // Notification ID
            'message' => $this->message,
            'url' => route('doctor.appointments.index'),
            'created_at' => now()->diffForHumans(),
        ]);
    }
}
