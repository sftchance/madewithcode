const fs = require('fs');

const { exec } = require('child_process');

const onExecute = (err, stdout, stderr) => {
    if (err) {
        console.log(err);
        return;
    }

    if (stdout)
        console.log(stdout);

    if (stderr)
        console.log(stderr);
};

const folders = fs.readdirSync('./')
    .filter(file => fs.statSync(`./${file}`).isDirectory());

const highest = folders.reduce((acc, folder) => {
    const number = parseInt(folder);
    
    return number > acc ? number : acc;
}, 0);

const next = `${(highest + 1).toString().padStart(3, '0')}`;

exec(`cp -r ./shared/template/ ./${next}`, onExecute);
exec(`cd ./${next}`, onExecute);
exec(`pnpm i`, onExecute);