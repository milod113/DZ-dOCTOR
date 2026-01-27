<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        // Get last 10 notifications
        return auth()->user()->notifications()->latest()->take(10)->get()->map(function($n) {
            return [
                'id' => $n->id,
                'data' => $n->data,
                'read_at' => $n->read_at,
                'created_at_human' => $n->created_at->diffForHumans()
            ];
        });
    }

    public function markAsRead($id)
    {
        auth()->user()->notifications()->where('id', $id)->first()?->markAsRead();
        return response()->noContent();
    }

    public function markAllRead()
    {
        auth()->user()->unreadNotifications->markAsRead();
        return response()->noContent();
    }
}
