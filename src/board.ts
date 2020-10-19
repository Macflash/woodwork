import { addLine, getScene, getScale, addPoints } from "./threetest";
import * as THREE from 'three';
import { Vector3 } from "three";

const Origin = new Vector3();

const boards: Board[] = [];

var pendingBoard: Board | null = null;

export function getPendingBoard() {
    return pendingBoard;
}

export function setPendingBoard(board: Board|null) {
    pendingBoard = board;
    pendingBoard?.drawToScene();
}

function getNewBoardName() {
    return `Board-${boards.length}`;
}

export function getSelectionLength() {
    return getBoards().filter(b => b.selected).length;
}

export function clearSelection() {
    getBoards().forEach(b => b.unselect());
}

export function getBoards() {
    return boards;
}

export function getBoardByName(name: string) {
    return boards.find(b => b.name === name);
}

export class Board {
    readonly name = getNewBoardName();
    private line: THREE.Line | null = null;

    public hovered = false;
    public selected = false;

    public vertices: Vector3[] = this.createVerts();

    constructor(public width: number, public height: number, public length: number, public origin: Vector3 = Origin, private pending = false) {
        boards.push(this);
    }

    setOrigin(origin: Vector3) {
        this.vertices.forEach(v => v.subVectors(v, this.origin));
        this.origin = origin;
        this.vertices.forEach(v => v.addVectors(v, this.origin));
        this.updateGeometry();
    }

    private createVerts() {
        const verts: Vector3[] = [];

        // front face
        verts.push(new Vector3(0, 0, 0));
        verts.push(new Vector3(this.width, 0, 0));
        verts.push(new Vector3(this.width, this.height, 0));
        verts.push(new Vector3(0, this.height, 0));

        verts.push(new Vector3(0, 0, this.length));
        verts.push(new Vector3(0, this.height, this.length));
        verts.push(new Vector3(this.width, this.height, this.length));
        verts.push(new Vector3(this.width, 0, this.length));

        return verts.map(v => v.add(this.origin));
    }

    updateGeometry(){
        var points = this.getLinePoints();
        this.line!.geometry = new THREE.BufferGeometry().setFromPoints(points);
    }

    updateColor() {
        if (this.pending) { this.line!.material = new THREE.LineBasicMaterial({ color: 0xFFFF00 }); }
        else if (this.selected) { this.line!.material = new THREE.LineBasicMaterial({ color: 0xFF0066 }); }
        else if (this.hovered) { this.line!.material = new THREE.LineBasicMaterial({ color: 0x00FFFF }); }
        else { this.line!.material = new THREE.LineBasicMaterial({ color: 0x00FF66 }); }
    }

    select() {
        this.selected = true;
        this.updateColor();
    }

    unselect() {
        this.selected = false;
        this.updateColor();
    }

    hover() {
        this.hovered = true;
        this.updateColor();
    }

    unhover() {
        this.hovered = false;
        this.updateColor();
    }

    fix(){
        this.pending = false;
        addLine(this.line!); // how can we remove these later?? Just remove all and re-add from boards??
        return this;
    }

    hide(){
        this.line!.visible = false;
    }

    show(){
        this.line!.visible = true;
    }

    drawToScene() {
        const scene = getScene();

        const points = this.getPoints();
        //scene.add(points);
        //addPoints(points);

        const line = this.getLines();
        scene.add(line);
        if(!this.pending){
            addLine(line);
        }
        //addLine(line);

        function animate() {
            requestAnimationFrame(animate);
            //line.rotateZ(.005);
            //line.rotateY(.001);
        }
        //animate();
        this.updateColor();
        return this;
    }

    getPoints() {
        var dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(this.vertices[0]);
        dotGeometry.vertices.push(this.vertices[1]);
        dotGeometry.vertices.push(this.vertices[2]);
        dotGeometry.vertices.push(this.vertices[3]);
        dotGeometry.vertices.push(this.vertices[4]);
        dotGeometry.vertices.push(this.vertices[5]);
        dotGeometry.vertices.push(this.vertices[6]);
        dotGeometry.vertices.push(this.vertices[7]);
        var dotMaterial = new THREE.PointsMaterial({ size: 2, sizeAttenuation: false });
        var dots = new THREE.Points(dotGeometry, dotMaterial);
        return dots;
    }

    getLinePoints() {
        var points = [];
        points.push(this.vertices[0]);
        points.push(this.vertices[4]);

        points.push(this.vertices[5]);
        points.push(this.vertices[3]);

        points.push(this.vertices[0]);
        points.push(this.vertices[1]);
        points.push(this.vertices[7]);
        points.push(this.vertices[4]);
        points.push(this.vertices[7]);
        points.push(this.vertices[6]);
        points.push(this.vertices[5]);
        points.push(this.vertices[6]);

        points.push(this.vertices[2]);
        points.push(this.vertices[1]);
        points.push(this.vertices[2]);
        points.push(this.vertices[3]);
        return points;
    }

    getLines() {
        var points = this.getLinePoints();
        var geometry = new THREE.BufferGeometry().setFromPoints(points);
        var material = new THREE.LineBasicMaterial({ color: 0x00FF66 });
        var line = new THREE.Line(geometry, material);
        line.name = this.name;
        this.line = line;
        return line;
    }

    rotateX(angle?: number) {
        console.log("angle", angle);
        angle = angle === undefined ? (Math.PI / 2) : angle;
        console.log("used angle", angle);
        this.vertices.forEach(v => v.subVectors(v, this.origin).applyAxisAngle(new Vector3(1, 0, 0), angle === undefined ? (Math.PI / 2) : angle).addVectors(v, this.origin));
        return this;
    }

    rotateY(angle?: number) {
        this.vertices.forEach(v => v.subVectors(v, this.origin).applyAxisAngle(new Vector3(0, 1, 0), angle === undefined ? (Math.PI / 2) : angle).addVectors(v, this.origin));
        return this;
    }

    rotateZ(angle?: number) {
        this.vertices.forEach(v => v.subVectors(v, this.origin).applyAxisAngle(new Vector3(0, 0, 1), angle === undefined ? (Math.PI / 2) : angle).addVectors(v, this.origin));
        return this;
    }
}