<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('menus')->insert([[
            'name' => "Main Menu",
            'parent_id' => '0'
        ],[
        'name' => "Sub Menu",
            'parent_id' => '1'
        ]]);
    }
}
