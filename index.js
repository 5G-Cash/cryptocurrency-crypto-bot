//var config = require('./config.js');
try{
  var config = process.cwd()+'/config.js';
  config = require(config);
}catch (error){
  console.error('ERROR -> Unable to load config file.');
  process.exit(1);
}

var chat = require("./functions/chat.js");
var check = require("./functions/check.js");
var command = require("./functions/command.js");
var cron = require("./functions/cron.js");
var log = require("./functions/log.js");

/* ------------------------------------------------------------------------------ */
// // // // // // // // // // // // // // // // // // // // // // // // // // // //
/* ------------------------------------------------------------------------------ */

const { Client, GatewayIntentBits, Partials, ActivityType } = require('discord.js');
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction
  ]
});
global.globalClient = client;

var cooldownTimes = {}; // Cooldown timers by user, id and timestamp

/* Latest active users */
var activeUsers = []; 

/* Whitelisted interfacable bots */
var whitelistedBots = [
  "918146218511708260" //RoyalSwap
];

/* BOT ENABLE/DISABLE */
var botEnabled = 1;

// Coin price if real price enabled on config
global.coinPrice = 0; 
global.coinCentPrice = 0;

/* ------------------------------------------------------------------------------ */
// // // // // // // // // // // // // // // // // // // // // // // // // // // //
/* ------------------------------------------------------------------------------ */

client.on('error', console.error);
process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

client.on('ready', () => {
  log.log_write_console(config.messages.botStarted + ` ${client.user.tag}!`);
  client.user.setPresence({ 
    activities: [{ 
      name: config.bot.gameMessage,
      type: ActivityType.Playing
    }],
    status: 'online'
  }); 
  if(config.bot.setNewAvatar){
    client.user.setAvatar(config.bot.avatar); 
  } 
});

client.on('messageCreate', msg => {
  var userID = msg.author.id;
  var userName = msg.author;
  var messageFull = msg;
  var messageType = msg.channel.type;
  var messageContent = msg.content;
  var channelID = msg.channel.id;
  var userRoles = 'none';
  var serverUsers = [];
  var userBot = msg.author.bot;
  var currentTimestamp = Math.floor(Date.now() / 1000);

  // Only check messages if its not the bot itself or another bot
  if(userID == config.bot.botID) 
    return;

  // Only check if its a normal user, or the bot is in the whitelist
  if(userBot && whitelistedBots.indexOf(msg.author.id) == -1) 
    return;

  // Save and delete active users by time
  activeUsers[userID] = currentTimestamp;
  for (var key in activeUsers) {
    if(activeUsers[key] < (currentTimestamp-config.bot.activeUserTime)){
      delete activeUsers[key];
    }
  }

// If message has command prefix
if(messageContent.startsWith(config.bot.commandPrefix)){

    // Get user role if not direct message 
    if(messageType !== 'dm'){
      try{
        var userRoles = msg.member.roles;
      }catch (error){
        log.log_write_console('Failed to get role 1');
        var userRoles = 'none';
      }
    }
    
    try{
      var userRole = check.check_user_role(userID,userRoles);
    }catch (error){
      log.log_write_console('Failed to get role 2');
      var userRole = 0;
    }

    // Enable / Disable bot commands
    // Check if command is start or stop
    var startStopCheck = messageContent.split(/ +/);
    if(startStopCheck[0].substr(1) === 'stop' && userRole == 3){
      botEnabled = 0;
      chat.chat_reply(msg,'embed',false,messageType,config.colors.special,false,false,false,config.messages.startstop.disabled,false,false,false,false);
      return;
    }
    if(startStopCheck[0].substr(1) === 'start' && userRole == 3){
      botEnabled = 1;
      chat.chat_reply(msg,'embed',false,messageType,config.colors.special,false,false,false,config.messages.startstop.enabled,false,false,false,false);
      return;
    }
    if(!botEnabled){
      return;
    }

    // If its not a dm message check if its a valid channel for commands
    if(!config.bot.allowAllChannels &&
        !check.check_respond_channel(channelID) &&
        messageType !== 'dm'){
        return;
    }

    // Check if admin mode is enabled and only allow commands from admins
    if(config.bot.adminMode && userRole != 3){
      if(messageType !== 'dm')
        msg.delete();
        chat.chat_reply(msg,'embed',userName,messageType,config.colors.warning,false,config.messages.title.warning,false,config.messages.adminMode,false,false,false,false);
      return;
    }

    // Save and check cooldown timer but ignor admins/mods/vips
    if(userRole < 1){ 
      if(cooldownTimes[userID] > (currentTimestamp-config.bot.cooldownTime) && cooldownTimes[userID] !== undefined){
        chat.chat_reply(msg,'embed',userName,messageType,config.colors.warning,false,config.messages.title.warning,false,config.messages.cooldown,false,false,false,false);
        return;
      }
      cooldownTimes[userID] = currentTimestamp;
    }

    // Check if direct messages to bot are disabled
    if(!config.bot.allowDM && messageType === 'dm'){ 
      chat.chat_reply(msg,'embed',userName,messageType,config.colors.error,false,config.messages.title.error,false,config.messages.DMDisabled,false,false,false,false);
      return;
    }

    // Check if its a valid message and if it use the right prefix
    if(!check.check_valid_content(messageContent)){ // if not valid
      // Delete message if not direct message and delete
      if(messageType !== 'dm')
        msg.delete();
      chat.chat_reply(msg,'embed',userName,messageType,config.colors.error,false,config.messages.title.error,false,config.messages.notValidCommand,false,false,false,false);
      return;
    }

    // Check if command is withdrawal request and not lowercase it because of address
    var withdrawalCheck = messageContent.split(/ +/);
    if(withdrawalCheck[0].substr(1) === 'w' || withdrawalCheck[0].substr(1) === 'withdraw'){
      var recievedCommand = messageContent.split(/ +/);
    }else{
      var recievedCommand = messageContent.toLowerCase().split(/ +/);
    }

    // Build recievedCommand partFive for drop phrase
    var dropPhrase = "";
    for (var i = 4 ; i < recievedCommand.length ; ++i){
      if(i != 4)
        dropPhrase = dropPhrase + ' ';
      dropPhrase = dropPhrase + recievedCommand[i];
      // If phrase is longer as defined on config
      if(dropPhrase.length > config.bot.dropMessageMaxLength){
        i = recievedCommand.length;
      }
    }
    // Cut it to max lengh and remove space on start and end
    dropPhrase = dropPhrase.substring(0,config.bot.dropMessageMaxLength);
    dropPhrase = dropPhrase.trim();

    // Check if command is on ignor list
    var ignorCheck = recievedCommand[0].substr(1);
    if(config.bot.commandIgnor.includes(ignorCheck)){
      return;
    }
    
    // Process command
    command.fire_command(messageFull,userID,userName,messageType,userRole,recievedCommand[0].substr(1),recievedCommand[1],recievedCommand[2],recievedCommand[3],dropPhrase,serverUsers,activeUsers);
}

});

// Start the bot
client.login(config.bot.botToken);

// Start cronjobs
if(config.wallet.check) // Check for new deposits
  cron.cron_get_deposits(); 
if(config.wallet.credit) // Credit new deposits
  cron.cron_credit_deposits();
if(config.staking.check) // Check for new stakes
  cron.cron_get_stakes();
if(config.staking.credit) // Credit new stakes
  cron.cron_credit_stakes();
if(config.coinPrice.enabled) // Get coin price 
  cron.cron_price();