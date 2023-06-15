const fs = require('fs');

const { exec } = require('child_process');

const getFolders = (dir) => {
    return fs.readdirSync(dir)
        .filter(file => fs.statSync(`${dir}/${file}`).isDirectory());
    }

const folders = getFolders('./');

const highest = folders.reduce((acc, folder) => {
    const number = parseInt(folder.split('-')[0]);
    return number > acc ? number : acc;
}, 0);

const next = `${(highest + 1).toString().padStart(3, '0')}`;

exec(`cp -r ./shared/template/ ./${next}`, (err, stdout, stderr) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log(stdout);
    
    if (stderr)
        console.log(stderr);
});

exec(`cd ./${next}`, (err, stdout, stderr) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log(stdout);
    
    if (stderr)
        console.log(stderr);
});

exec(`pnpm i`, (err, stdout, stderr) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log(stdout);
    
    if (stderr)
        console.log(stderr);
});