import * as THREE from 'three';
import { Vector2, Vector3 } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { getBoardByName, getBoards, getPendingBoard, setPendingBoard } from './board';
import { renderApp } from './renderHelper';

type ActionMode = "MOVE" | "SELECT" | "ADD";

var actionMode: ActionMode = "MOVE";

export function GetMode() {
    return actionMode;
}

export function SetMode(mode: ActionMode) {
    if (actionMode === mode) { return; }

    actionMode = mode;
    if (actionMode === "MOVE") {
        controls.enabled = true;
    }
    else {
        controls.enabled = false;
    }

    renderApp();
}

var scene = new THREE.Scene();
var lines: THREE.Line[] = [];
var points: THREE.Points[] = [];
var scale = 10;

export function getScale() { return scale; }
export function getScene() { return scene; }

export function addLine(line: THREE.Line) {
    lines.push(line);
}
export function addPoints(pt: THREE.Points) {
    points.push(pt);
}

var camera: THREE.PerspectiveCamera;
var controls: OrbitControls;

export function getControlsState() {
    return controls.enabled;
}

export function setControls(enabled: boolean) {
    controls.enabled = enabled;
}

export function setupThreeScene() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(25, 50, 100);
    camera.lookAt(25, 25, 25);
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const origin = new Vector3(0, 0, 0);
    const axisScale = 10;
    const xAxis = new Vector3(axisScale, 0, 0);
    const yAxis = new Vector3(0, axisScale, 0);
    const zAxis = new Vector3(0, 0, axisScale);

    function addLineToScene(points: Vector3[], color = 0xFFFFFF) {
        var geometry = new THREE.BufferGeometry().setFromPoints(points);
        var material = new THREE.LineBasicMaterial({ color });
        var line = new THREE.Line(geometry, material);
        scene.add(line);
    }

    function initOrigin() {
        addLineToScene([origin, xAxis], 0xFF0000);
        addLineToScene([origin, yAxis], 0x00FF00);
        addLineToScene([origin, zAxis], 0x0000FF);
    }

    initOrigin();

    //var geometry = new THREE.BoxGeometry();
    //var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    //var cube = new THREE.Mesh( geometry, material );
    //scene.add( cube );
    //    camera.position.z = 5;


    // Interaction stuff for lines
    var hovergeometry = new THREE.SphereBufferGeometry(.5);
    var hovermaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const sphereInter = new THREE.Mesh(hovergeometry, hovermaterial);
    sphereInter.visible = false;
    scene.add(sphereInter);

    var hovergeometry = new THREE.SphereBufferGeometry(1);
    var hovermaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const ptInter = new THREE.Mesh(hovergeometry, hovermaterial);
    ptInter.visible = false;
    scene.add(ptInter);

    const mouse = new THREE.Vector2();
    const lastMouse = new THREE.Vector2();

    let mouseDown = false;

    document.oncontextmenu = e => {
        if(actionMode==="ADD"){

            e.preventDefault?.();
            e.stopPropagation?.();
            return false;
        }
    };

    document.addEventListener('mousedown', e => {
        console.log("click!",e);
        if (!mouseDown && actionMode === "SELECT") {
            if(e.button === 2) { return; }
            var intersects = raycaster.intersectObjects(lines, true);

            if (intersects.length > 0) {
                const board = getBoardByName(intersects[0].object.name);
                if (board) {
                    console.log("Selected! ", board);
                    if (board.selected) {
                        board.unselect();
                    }
                    else {
                        board.select();
                    }
                    renderApp();
                }
            }
        }

        if (!mouseDown && actionMode === "ADD" && getPendingBoard()) {
            if(e.button === 2) { 
                // rotate the item somehow...

                getPendingBoard()!.rotateX().setOrigin(getPendingBoard()!.origin);

                return;
             }
             else {
                var intersects = raycaster.intersectObjects(lines, true);

                if (intersects.length > 0) {
                    getPendingBoard()?.setOrigin(intersects[0].point);
                    const newBoard = getPendingBoard()!;
                    newBoard.fix();
                    setPendingBoard(null);
                    renderApp();
                }
             }
        }

        mouseDown = true;
    });

    document.addEventListener('keydown', e => {
        if(actionMode === "ADD"){
            const pendingBoard = getPendingBoard();
            if(pendingBoard){
                switch (e.key){
                    case "a":
                    pendingBoard.rotateY();
                    break;
                    case "d":
                    pendingBoard.rotateY(Math.PI / -2);
                    break;
                    
                    case "s":
                    pendingBoard.rotateX();
                    break;
                    case "w":
                    pendingBoard.rotateX(Math.PI / -2);
                    break;
                    
                    case "q":
                    pendingBoard.rotateZ();
                    break;
                    case "e":
                    pendingBoard.rotateZ(Math.PI / -2);
                    break;
                }
            }
        }

        if (e.key === "m" || e.key === "Escape") {
            SetMode("MOVE");
        }
        if (e.key === "s") {
        //    SetMode("SELECT");
        }
        if (e.key === "a") {
         //   SetMode("ADD");
        }
    });

    document.addEventListener('mouseup', e => {
        mouseDown = false;
    });

    document.addEventListener('mousemove', (event) => {
        lastMouse.x = mouse.x;
        lastMouse.y = mouse.y;
        // track mouse location
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }, false);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    const raycaster = new THREE.Raycaster()!;
    raycaster.params.Line!.threshold = 2;
    raycaster.params.Points!.threshold = .5;

    function renderLinePoint() {
        if (actionMode !== "ADD") { return; }
        getBoards().forEach(b => b.unhover());
        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(lines, true);

        if (intersects.length > 0) {
            sphereInter.visible = true;
            sphereInter.position.copy(intersects[0].point);

            const board = getBoardByName(intersects[0].object.name);
            if (board) {
                board.hover();
            }

            const pendingBoard = getPendingBoard();
            if (pendingBoard) {
            getPendingBoard()?.show();
            pendingBoard.setOrigin(intersects[0].point);
            }

        } else {
            sphereInter.visible = false;
            getPendingBoard()?.hide();
        }
    }

    function renderLineHover() {
        if (actionMode !== "SELECT") { return; }
        getBoards().forEach(b => b.unhover());

        // find intersections
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(lines, true);
        if (intersects.length > 0) {
            const board = getBoardByName(intersects[0].object.name);
            if (board) {
                board.hover();
            }

        }
    }

    function labelAxes(axis: Vector3, id: string, label: string, color: string) {
        const vector = new Vector3().copy(axis).project(camera);
        vector.x = (vector.x + 1) * window.innerWidth / 2;
        vector.y = - (vector.y - 1) * window.innerHeight / 2;
        vector.z = 0;

        let el = document.getElementById(id);
        if (!el) {
            el = document.createElement("div");
            el.id = id;
            el.style.position = "absolute";
            document.body.appendChild(el);
            el.style.color = color;
        }

        el.innerText = label;
        el.style.top = vector.y + "px";
        el.style.left = vector.x + "px";
    }

    // Finally render the scene!
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderLineHover();
        renderLinePoint();

        labelAxes(xAxis, "xaxis", "X", "red");
        labelAxes(yAxis, "yaxis", "Y", "green");
        labelAxes(zAxis, "zaxis", "Z", "blue");

        renderer.render(scene, camera);

    }

    animate();
}
