<?php

namespace App\Http\Controllers;

use App\Models\Schedules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ScheduleController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $schedules = $user->schedules; 

        return response()->json($schedules);
    }

    public function store(Request $request)
    {
        $request->validate([
            'day_start' => 'required|string',
            'day_end' => 'required|string',
            'hour_start' => 'required',
            'hour_end' => 'required',
        ]);

        $user = Auth::user(); 
        $schedule = new Schedules([
            'day_start' => $request->day_start,
            'day_end' => $request->day_end,
            'hour_start' => $request->hour_start,
            'hour_end' => $request->hour_end,
            'user_id' => $user->id, 
        ]);

        $schedule->save();

        return response()->json(['message' => 'Schedule created successfully!', 'schedule' => $schedule]);
    }

    public function update(Request $request, Schedules $schedule)
    {
        $request->validate([
            'day_start' => 'required|string',
            'day_end' => 'required|string',
            'hour_start' => 'required',
            'hour_end' => 'required',
        ]);

        $schedule->update([
            'day_start' => $request->day_start,
            'day_end' => $request->day_end,
            'hour_start' => $request->hour_start,
            'hour_end' => $request->hour_end,
        ]);

        return response()->json(['message' => 'Schedule updated successfully!', 'schedule' => $schedule]);
    }

    public function destroy(Schedules $schedule)
    {
        $schedule->delete();

        return response()->json(['message' => 'Schedule deleted successfully!']);
    }
    public function show($id)
    {
        $schedules = Schedules::where('user_id', $id)->get();

        return response()->json($schedules);
    }
}

