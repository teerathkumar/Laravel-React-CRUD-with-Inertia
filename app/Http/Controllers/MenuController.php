<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class MenuController extends Controller
{
    //
    function buildTree(array $elements, $parentId = 0) {
        $branch = array();

        foreach ($elements as $element) {
//            array_push($element, $element->children);
            if ($element['parent_id'] == $parentId) {
                $children = $this->buildTree($elements, $element['id']);

                if ($children) {
                    $element['children'] = $children;
                }
                $branch[] = $element;
            }
        }

        return $branch;
    }
    private function getData()
    {
        $menus = Menu::with("children")->get();
//        $newArray = $this->buildTree($menus);

//        die;
        $newArray = [

        ];

        if($menus){

            $i=0;
            foreach($menus as $menu){
                if($i==0){
                    $newArray[$i] = ['id'=>0, 'name'=>"",'children'=>[],'parent'=>null];
                }
                $i++;
                $newArrayC = [];
                $id = $menu->id;
                $title = $menu->name;
                $parent_id = $menu->parent_id;
                if(!$parent_id){
                    $newArray[0]['children'][] = $id;
                }
                $children = $menu->children;
                if($children){
                    foreach($children as $child){
                        $newArrayC[] = $child->id;
                    }
                }
                $menu_order = $menu->order;

                if(!$parent_id){
                    $newArray[$i] = ['id'=>$id, 'name'=>$title,'children'=>$newArrayC,'parent'=>$parent_id,'isBranch'=>true];
                } else {
                    $newArray[$i] = ['id'=>$id, 'name'=>$title,'children'=>$newArrayC,'parent'=>$parent_id];
                }

            }
        }
        else{
            $newArray[0] = ['id'=>0, 'name'=>"",'children'=>[],'parent'=>null];
        }
        return $newArray;
    }
    public function index(){

        $myNewAr = json_encode($this->getData(), true);
//        echo "<pre>";
//        print_r($newArray);
//        echo "</pre>";
        return Inertia::render('Menus/Index', ['menus' => $myNewAr]);
    }
    public function store(Request $request)
    {
//        dd($request->all());
        Validator::make($request->all(), [
            'name' => ['required'],
            'parent_id' => ['required'],
        ])->validate();
        Menu::create($request->all());
        $myNewAr = json_encode($this->getData(), true);
//        return response()->json($myNewArray);
        return Inertia::render('Menus/Index', ['menus' => $myNewAr]);
//        return redirect()->route('menus.index');
    }

}
