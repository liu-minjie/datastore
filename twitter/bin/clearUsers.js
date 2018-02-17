const fs = require('fs');
const path = require('path');
const statDir = path.resolve(__dirname, '../../../twitterbot/users/') + '/' ;
const dir = fs.readdirSync(statDir);

[].slice.call(dir, 0).filter((filename) => {
	return /\.json$/.test(filename);
}).forEach((filename) => {
	const data = require(`${statDir}${filename}`);
	data.lists = [data.lists[0]];
	fs.writeFileSync(`${statDir}${filename}`, JSON.stringify(data, null, 1), "utf8");
});


