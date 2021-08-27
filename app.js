const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const Firestore = require('@google-cloud/firestore');
const db = new Firestore({
    projectId: "tilde-323223",
    keyFilename: 'k.json',
});

port = 8181;


const robot = require('robotjs');
robot.setMouseDelay(0);
const size = robot.getScreenSize();


app.get('/command', (req, res) => {
    robot.setMouseDelay(0);
    robot.setKeyboardDelay(0);
    let down;
    switch (req.query.type) {
        case 'move':
            let x = req.query.x;
            let y = req.query.y;
            if (isNaN(x) || isNaN(y)) {
                res.send('error');
            }
            if (x < 0) {
                x = 0;
            }
            else if (x > 1) {
                x = 1;
            }
            if (y < 0) {
                y = 0;
            }
            else if (y > 1) {
                y = 1;
            }
            let yCoord = y * size.height;
            robot.moveMouse(x * size.width, yCoord);
            break;
        case 'mouse':
            if (req.query.right) {
                down = req.query.down;
                if (down === 'true') {
                    robot.mouseToggle('down', 'right');
                }
                else {
                    robot.mouseToggle('up', 'right');
                }
            }
            else {
                down = req.query.down;
                if (down === 'true') {
                    robot.mouseToggle('down', 'left');
                }
                else {
                    robot.mouseToggle('up', 'left');
                }
            }
            break;
        case 'scroll':
            const xc = -req.query.x;
            const yc = -req.query.y;
            if (Math.abs(xc) > Math.abs(yc)) {
                robot.scrollMouse(xc, 0);
            }
            else {
                robot.scrollMouse(0, yc);
            }
            break;
        case 'paste':
            robot.typeString(req.query.string);
            break;
        case 'key':
            const key = req.query.key;
            let modifier = req.query.modifier;
            if (modifier) {
                robot.keyTap(key, modifier);
            }
            else {
                robot.keyTap(key);
            }
            break;
    }
    res.send();
});

app.listen(port, () => console.log(`Server started on on port ${port}`));