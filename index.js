const DATA = require('./settings.json')
const EMOJI = DATA.EMOJI;

const yt = require('yt-channel-info')
const settings = {
    channelId: 'UCHC6XUkn1gXQq6bsk5fu0ww',
    sortBy: 'newest',
    channelIdType: 0,
}

const { Client, MessageEmbed } = require('discord.js')
const client = new Client()
client.login(DATA.token)


client.on("ready", () => {
    console.log('CONNECTED TO : ' + client.user.tag)


    setInterval(() => {
        const MSG = new MessageEmbed()
        .setColor('#0e721a')
        .setTimestamp()
        
        var DATE = new Date;
        var TIME = `${DATE.getHours()}:${DATE.getMinutes()}`;

        if (TIME === DATA.TIME) {
            yt.getChannelInfo(settings).then((response) => {
                if (!response.alertMessage) {
                    var Thumbnaillenght = response.authorThumbnails.length;
                    var Bannerlenght = response.authorBanners.length;

                    var NAME = response.author;
                    var CHANNELURL = response.authorUrl;
                    var ICON = response.authorThumbnails[Thumbnaillenght - 1].url;
                    var IMG = response.authorBanners[Bannerlenght - 1].url;
                    var DES = response.description;
                    var SUBCOUNT = response.subscriberCount;
                    var TL = response.channelLinks.primaryLinks[0].url;
                    var IG = response.channelLinks.secondaryLinks[0].url;

                    MSG.setAuthor(NAME, ICON, CHANNELURL)
                    MSG.setImage(IMG)
                    MSG.description
                    MSG.setDescription(DES + `\n\n${EMOJI.YT} [YouTube](${CHANNELURL}) | ${EMOJI.TL} [Telegram](${TL}) | ${EMOJI.IG} [Instagram](${IG})`)
                    MSG.addFields(
                        { name: EMOJI.SUB + ' Subscribers', value: SUBCOUNT, inline: true },
                    )
                }
            })

            yt.getChannelStats(settings).then((response) => {
                var MAXVIEW = response.viewCount;

                MSG.addFields(
                    { name: EMOJI.VIEW + ' Total Channel View', value: MAXVIEW, inline: true },
                )
            })

            yt.getChannelVideos(settings).then((response) => {
                if (!response.alertMessage) {
                    MSG.addFields(
                        { name: '\u200B', value: '\u200B' },
                    )
                    response.items.forEach(video => {
                        var TITLE = video.title;
                        var VIEW = video.viewCount;
                        var TIME = video.durationText
                        var AGO = video.publishedText
                        MSG.addFields(
                            { name: TITLE, value: EMOJI.VIEW + ' ' + VIEW + '\n' + EMOJI.TIME + ' ' + TIME + '\n' + EMOJI.AGO + ' ' + AGO, inline: true },
                        )
                    })

                    client.channels.cache.get(DATA.CHANNEL).send(MSG)
                }
            })
        }
    }, 60000);

})
