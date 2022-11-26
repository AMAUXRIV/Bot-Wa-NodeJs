const qrcode = require('qrcode-terminal');
const {
	Client,
	LocalAuth
} = require('whatsapp-web.js');

const axios = require('axios');


const client = new Client({
	authStrategy: new LocalAuth()
});

client.on('qr', qr => {
	qrcode.generate(qr, {
		small: true
	});
});

client.on('ready', () => {
	console.log('Bot Siap Amau ');
});

client.on('message', async msg => {
	const text = msg.body.toLowerCase() || '';

	if (text === 'halo') {
		msg.reply('```*Amaux Reav*``` \n_____________nhalo juga');
	} else if (text === 'oy') {
		msg.reply('*Amaux Reav* \n_____________\napa oy');

	} else if (text.includes("edit_bg/")) {
		const cmd = text.split('/');
		if (cmd.length < 2) {
			msg.reply('Format mu Salah , ketik edit_bg/warna');
		}
		const color = cmd[1];

		if (msg.hasMedia) {
			if (msg.type != 'image') {
				return msg.reply('hanya bisa edit dengan format .image');
			}
			msg.reply('sedang di proses');
			const media = await msg.downloadMedia();
			const chat = await msg.getChat();

			if (media) {
				const newPhoto = await EditPhoto(media.data, color);
				if (!newPhoto.success) {
					return msg.reply('Terjadi Kesalahan .');
				}

				media.data = newPhoto.base64;
				chat.sendMessage(media, {
					caption: '```*Amaux Reav*``` \n_____________\nHasil Edit \n bisa kali subs https://www.remove.bg/r/BFywAhBEKGEdxCjEjPLX4UGJ'
				});

			}
		}
	} else if (text !== 'halo' && text !== 'oy' && text !== 'edit_bg/') {
		msg.reply('*Saya Bot* ```Amaux-Reav``` \n ________________\ntunggu tuan saya yang balas');
	}

});



client.initialize();

const EditPhoto = async (base64, color) => {
	const result = {
		success: false,
		base64: null,
		message: "",
	}

	return await axios({
			method: 'post',
			url: 'https://api.remove.bg/v1.0/removebg',
			data: {
				image_file_b64: base64,
				bg_color: color,
			},
			headers: {
				'accept': 'application/json',
				'Content-Type': 'application/json',
				'X-Api-Key': 'ur api key'
			},

		})
		.then((response) => {

			if (response.status === 200) {
				result.success = true;
				result.base64 = response.data.data.result_b64;
				return result;
			} else {
				result.message = 'Terjadi Kesalahan';

			}
			return result;
		})
		.catch((error) => {
			result.message = `error${error.message}`;
			return result;
		});

}