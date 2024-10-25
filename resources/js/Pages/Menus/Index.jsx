import React, {useCallback, useRef, useState } from 'react';

import Authenticated from '@/Layouts/AuthenticatedLayout.jsx'

import { Inertia } from "@inertiajs/inertia";

import {Head, usePage, Link, useForm} from '@inertiajs/react';

import { FaSquare, FaCheckSquare, FaMinusSquare, FaPlus, FaPlusCircle } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import { AiOutlineLoading } from "react-icons/ai";
import TreeView from "react-accessible-treeview";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import cx from "classnames";
import "@/Pages/Menus/styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Dashboard(props) {

    // const { menus } = usePage().props
    const { menus: initialMenus } = usePage().props; // Get menus from props

    const [menus, setMenus] = useState(initialMenus); // Initialize state with menus
    const [hover, setHover] = useState(false);
    const onHover = (id) => {
        setHover(true);
        toggleButton(id, true);
        // console.log("hover: "+id);
    };

    const onLeave = (id) => {
        setHover(false);
        toggleButton(id, false);
        // console.log("Leave: "+id);
    };

    const toggleButton = (id, status)=>{
        if(!status) {
            document.getElementById("my_id_"+id).style.display = "none";

        } else {

            document.getElementById("my_id_"+id).style.display = "block";
        }
    }


    const { data, setData, errors, post } = useForm({

        name: "",
        parent_id: "",

    });

    function handleSubmit(e) {
        e.preventDefault();
        // post(route("menus.store"));
        post(route("menus.store"), {
            onSuccess: (page) => {
                // Update menus with the newly added menu
                // console.log(page.props.menus);
                setInitialData(JSON.parse(page.props.menus)  ); // Adjust based on your response structure
                toggle();
            },
        });
    }
    const loadedAlertElement = useRef(null);
    const [dataInitial, setInitialData] = useState(JSON.parse(menus));
    const [nodesAlreadyLoaded, setNodesAlreadyLoaded] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectChildren, setSelectChildren] = useState(false);
    const [preserveSelection, setPreserveSelection] = useState(false);
    const [manuallySelectedNodes, setManuallySelectiedNodes] = useState([]);

    const [modal, setModal] = useState(false);
    const [myParentId, setParentId] = useState(false)
    const modelFunc=(id)=>{
        toggle();
        setParentId(id);
    }
    const toggle = () => {
        setModal(!modal)
        // setParentId(id);
    };
    const updateTreeData = (list, id, children) => {
        const data = list.map((node) => {
            if (node.id === id) {
                node.children = children.map((el) => {
                    return el.id;
                });
            }
            return node;
        });
        return data.concat(children);
    };

    const onLoadData = ({ element }) => {
        return new Promise((resolve) => {
            if (element.children.length > 0) {
                resolve();
                return;
            }
            setTimeout(() => {
                setInitialData((value) =>
                    updateTreeData(value, element.id, [
                        {
                            name: `Child Node ${value.length}`,
                            children: [],
                            id: value.length,
                            parent: element.id,
                            isBranch: true,
                        },
                        {
                            name: "Another child Node",
                            children: [],
                            id: value.length + 1,
                            parent: element.id,
                        },
                    ])
                );
                if (selectChildren) {
                    preserveSelection
                        ? setSelectedIds([
                            ...new Set([...manuallySelectedNodes, ...selectedIds]),
                            dataInitial.length,
                            dataInitial.length + 1,
                        ])
                        : setSelectedIds([dataInitial.length, dataInitial.length + 1]);
                }
                resolve();
            }, 1000);
        });
    };

    const wrappedOnLoadData = async (props) => {
        const nodeHasNoChildData = props.element.children.length === 0;
        const nodeHasAlreadyBeenLoaded = nodesAlreadyLoaded.find(
            (e) => e.id === props.element.id
        );

        await onLoadData(props);

        if (nodeHasNoChildData && !nodeHasAlreadyBeenLoaded) {
            const el = loadedAlertElement.current;
            setNodesAlreadyLoaded([...nodesAlreadyLoaded, props.element]);
            el && (el.innerHTML = `${props.element.name} loaded`);

            // Clearing aria-live region so loaded node alerts no longer appear in DOM
            setTimeout(() => {
                el && (el.innerHTML = "");
            }, 5000);
        }
    };

    const handleNodeSelect = ({ element, isSelected }) => {
        isSelected &&
        setManuallySelectiedNodes([...manuallySelectedNodes, element.id]);
        !isSelected &&
        setManuallySelectiedNodes(
            manuallySelectedNodes.filter((id) => id === element.id)
        );
    };
    const AddMenu = () =>{

        alert("clicked");
    }
    const ArrowIcon = ({ isOpen, className }) => {
        const baseClass = "arrow";
        const classes = cx(
            baseClass,
            { [`${baseClass}--closed`]: !isOpen },
            { [`${baseClass}--open`]: isOpen },
            className
        );
        return <IoMdArrowDropright className={classes} />;
    };

    return (

        <Authenticated

            auth={props.auth}

            errors={props.errors}

            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Menus</h2>}

        >

            <Head title="Menu" />


            <Modal isOpen={modal} toggle={toggle}>
                <form name="createForm" onSubmit={handleSubmit}>
                    <ModalHeader toggle={toggle}>Add Menu</ModalHeader>
                    <ModalBody>

                        <div className="row m-2">
                            <input type={"text"} placeholder={"Enter Menu Name"} name="name"
                                   value={data.name}

                                   onChange={(e) =>

                                       setData("name", e.target.value)

                                   }

                            />
                        </div>
                        <div className="row m-2">
                            <input type={"number"} placeholder={"Enter Parent ID"} name="parent_id"

                                   value={myParentId}
                                   onChange={(e) =>

                                       setData("parent_id", e.target.value)

                                   }
                            />
                        </div>

            </ModalBody>
            <ModalFooter>
            <Button color="primary" type="submit">
                        Save
                    </Button>{' '}
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
                </form>
            </Modal>


            <div className="py-12">


                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">


                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">


                        <div className="p-6 bg-white border-b border-gray-200">

                            <div>


                                <div
                                    className="visually-hidden"
                                    ref={loadedAlertElement}
                                    role="alert"
                                    aria-live="polite"
                                ></div>
                                {/*<button onClick={() => setSelectChildren(!selectChildren)}>*/}
                                {/*    Select next loaded children - [{JSON.stringify(selectChildren)}]*/}
                                {/*</button>*/}
                                {/*<button*/}
                                {/*    onClick={() => setPreserveSelection(!preserveSelection)}*/}
                                {/*    style={{ marginLeft: "16px" }}*/}
                                {/*>*/}
                                {/*    Preserve current selection - [{JSON.stringify(preserveSelection)}]*/}
                                {/*</button>*/}
                                <div className="checkbox">
                                    <TreeView
                                        data={dataInitial}
                                        aria-label="Checkbox tree"
                                        onLoadData={wrappedOnLoadData}
                                        onNodeSelect={handleNodeSelect}
                                        selectedIds={selectedIds}
                                        multiSelect
                                        propagateSelect
                                        togglableSelect
                                        propagateSelectUpwards
                                        nodeRenderer={({
                                                           element,
                                                           isBranch,
                                                           isExpanded,
                                                           isSelected,
                                                           isHalfSelected,
                                                           getNodeProps,
                                                           level,
                                                           handleSelect,
                                                           handleExpand,
                                                       }) => {
                                            const branchNode = (isExpanded, element) => {
                                                return isExpanded && element.children.length === 0 ? (
                                                    <>
                    <span
                        role="alert"
                        aria-live="assertive"
                        className="visually-hidden"
                    >
                      loading {element.name}
                    </span>
                                                        <AiOutlineLoading
                                                            aria-hidden={true}
                                                            className="loading-icon"
                                                        />
                                                    </>
                                                ) : (
                                                    <ArrowIcon isOpen={isExpanded}/>
                                                );
                                            };
                                            return (
                                                <div className={"new-node"} onMouseEnter={()=>onHover(element.id)}
                                                     onMouseLeave={()=>onLeave(element.id)}>
                                                    <div
                                                        {...getNodeProps({onClick: handleExpand})}
                                                        style={{marginLeft: 40 * (level - 1)}}
                                                    >
                                                        {isBranch && branchNode(isExpanded, element)}
                                                        {/*<CheckBoxIcon*/}
                                                        {/*    className="checkbox-icon"*/}
                                                        {/*    onClick={(e) => {*/}
                                                        {/*        !isExpanded && handleExpand(e);*/}
                                                        {/*        handleSelect(e);*/}
                                                        {/*        e.stopPropagation();*/}
                                                        {/*    }}*/}
                                                        {/*    variant={*/}
                                                        {/*        isHalfSelected ? "some" : isSelected ? "all" : "none"*/}
                                                        {/*    }*/}
                                                        {/*/>*/}
                                                        <span className="name">
                        {element.name} ({element.id})
                  </span>

                                                    </div>
                                                    <button id={"my_id_"+element.id}
                                                            onClick={() => modelFunc(element.id)}><FaPlusCircle />
                                                    </button>
                                                </div>
                                            );
                                        }}
                                    />
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </div>


        </Authenticated>

    );

}
