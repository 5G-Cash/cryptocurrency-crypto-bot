//var config = require('../config.js');
try{
    var config = process.cwd()+'/config.js';
    config = require(config);
}catch (error){
    console.error('ERROR -> Unable to load config file.');
    process.exit(1);
}

/* ------------------------------------------------------------------------------ */
// // // // // // // // // // // // // // // // // // // // // // // // // // // //
/* ------------------------------------------------------------------------------ */

// A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.
const moment = require('moment-timezone');

const { EmbedBuilder } = require('discord.js');

const Big = require('big.js'); // https://github.com/MikeMcl/big.js -> http://mikemcl.github.io/big.js/

/* ------------------------------------------------------------------------------ */
// // // // // // // // // // // // // // // // // // // // // // // // // // // //
/* ------------------------------------------------------------------------------ */

module.exports = {
    chat_build_reply: function(replyType,replyUsername,senderMessageType,replyEmbedColor,replyAuthor,replyTitle,replyFields,replyDescription,replyFooter,replyThumbnail,replyImage,replyTimestamp){
        if(replyType == 'normal'){
            if(senderMessageType == 'dm' || !replyUsername){
                return replyDescription;
            }else{
                return  replyDescription + ' ' + replyUsername;
            }
        }
        if(replyType === 'embed' || replyType === 'private'){
            var embed = new EmbedBuilder();
            // Set embed color
            if(replyEmbedColor){
                embed.setColor(replyEmbedColor);
            }else{
                embed.setColor(config.colors.normal);
            }
            // Set reply autor
            if(replyAuthor){
                var replyAuthorName = '';
                var replyAuthorIcon = '';
                var replyAuthorLink = '';
                if(replyAuthor[0])
                    replyAuthorName = replyAuthor[0];
                if(replyAuthor[1])
                replyAuthorIcon = replyAuthor[1];
                if(replyAuthor[2])
                    replyAuthorLink = replyAuthor[2];
                embed.setAuthor({
                    name: replyAuthorName,
                    iconURL: replyAuthorIcon,
                    url: replyAuthorLink
                });
            }
            // Set Title
            if(replyTitle){
                embed.setTitle(replyTitle.toUpperCase());
            }
            // Set description
            if(replyDescription){
                if(senderMessageType === 'dm' || !replyUsername){
                    embed.setDescription(replyDescription);
                }else{
                    embed.setDescription(replyDescription + ' ' + replyUsername);
                }
            }
            // Set reply fields
            for (var i = 0 ; i < replyFields.length ; ++i){
                if(replyFields[i][0] === 0 && replyFields[i][1] === 0){
                    embed.addFields({ name: '\u200B', value: '\u200B', inline: replyFields[i][2] });
                }else{
                    embed.addFields({ name: replyFields[i][0], value: replyFields[i][1], inline: replyFields[i][2] });
                }
            }
            // Set reply footer
            if(replyFooter){
                var replyFooterText = '';
                var replyFooterIcon = '';
                if(replyFooter[0])
                    replyFooterText = replyFooter[0];
                if(replyFooter[1])
                    replyFooterIcon = replyFooter[1];
                embed.setFooter({
                    text: replyFooterText,
                    iconURL: replyFooterIcon
                });
            }
            // Set thumbnail
            if(replyThumbnail){
                embed.setThumbnail(replyThumbnail);
            }   
            // Set image
            if(replyImage){
                embed.setImage(replyImage);
            }
            // Set timestamp
            if(replyTimestamp){
                embed.setTimestamp();
            }
            // all done and return embed
            return embed;
        }
    },

    chat_reply: function(msg,replyType,replyUsername,senderMessageType,replyEmbedColor,replyAuthor,replyTitle,replyFields,replyDescription,replyFooter,replyThumbnail,replyImage,replyTimestamp){
        if(replyType == 'private'){
            return msg.author.send({ embeds: [this.chat_build_reply(replyType,replyUsername,senderMessageType,replyEmbedColor,replyAuthor,replyTitle,replyFields,replyDescription,replyFooter,replyThumbnail,replyImage,replyTimestamp)] });
        }else if(replyType == 'pool'){
            var poolChannel = globalClient.channels.cache.get(config.bot.stakePoolChannelID);
            return poolChannel.send({ embeds: [this.chat_build_reply(replyType,replyUsername,senderMessageType,replyEmbedColor,replyAuthor,replyTitle,replyFields,replyDescription,replyFooter,replyThumbnail,replyImage,replyTimestamp)] });
        }else{
            return msg.channel.send({ embeds: [this.chat_build_reply(replyType,replyUsername,senderMessageType,replyEmbedColor,replyAuthor,replyTitle,replyFields,replyDescription,replyFooter,replyThumbnail,replyImage,replyTimestamp)] });
        }
    }
};