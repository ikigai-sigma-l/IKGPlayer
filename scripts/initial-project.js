const { exec } = require('child_process');
const path = require('path');
const fs = require('fs')

function initProject() {
    return new Promise((resolve, reject) => {
        const targetDir = path.resolve(__dirname, '../')
        exec('npm install', { cwd: targetDir }, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ npm install fails: ${error.message}`);
                console.error(`⚠️ error message:\n${stderr}`);
                reject()
            }
            resolve()
        });
    })
}

function initCommon() {
    return new Promise((resolve, reject) => {
        const targetDir = path.resolve(__dirname, '../src/common')
        exec('npm install', { cwd: targetDir }, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ npm install fails: ${error.message}`);
                console.error(`⚠️ error message:\n${stderr}`);
                reject()
            }
            resolve()
        });
    })
}

function initCheap() {
    const file = path.resolve(__dirname, '../src/common/package.json')
    const json = JSON.parse(fs.readFileSync(file, 'utf8'))
    const dependencies = json.dependencies
    json.dependencies = {}
    fs.writeFileSync(file, JSON.stringify(json, null, 2), 'utf8')

    const targetDir = path.resolve(__dirname, '../src/cheap')

    return new Promise((resolve, reject) => {
        const targetDir = path.resolve(__dirname, '../src/cheap')
        exec('npm install', { cwd: targetDir }, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ npm install fails: ${error.message}`);
                console.error(`⚠️ error message:\n${stderr}`);
                reject()
            }
            resolve()
        });
    }).then(() => {
        json.dependencies = dependencies
        fs.writeFileSync(file, JSON.stringify(json, null, 2), 'utf8')
    })
}

async function main() {
    await initProject()
    await initCommon()
    await initCheap()    
}

main()

