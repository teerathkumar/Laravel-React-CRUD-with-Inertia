import React, { useRef, useState } from "react";
import { FaSquare, FaCheckSquare, FaMinusSquare, FaPlus, FaPlusCircle } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import { AiOutlineLoading } from "react-icons/ai";
import TreeView from "react-accessible-treeview";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import cx from "classnames";
import "../../css/styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {post} from "axios";
import {useForm} from "@inertiajs/react";


function MultiSelectCheckboxAsyncControlled({initialData}) {
    // alert(JSON.parse(initialData));


    return (
        <>
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
                        data={data}
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
                                    <ArrowIcon isOpen={isExpanded} />
                                );
                            };
                            return (
                                <div className={"new-node"}>
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
                    {element.name}
                  </span>

                                </div>
                            <button onClick={toggle} style={{marginLeft:5}}><FaPlusCircle /></button>
                                </div>
                            );
                        }}
                    />
                </div>
            </div>
        </>
    );
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

const CheckBoxIcon = ({ variant, ...rest }) => {
    switch (variant) {
        case "all":
            return <FaCheckSquare {...rest} />;
        case "none":
            return <FaSquare {...rest} />;
        case "some":
            return <FaMinusSquare {...rest} />;
        default:
            return null;
    }
};

export default MultiSelectCheckboxAsyncControlled;
