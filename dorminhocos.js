let settingsLoad = JSON.parse(localStorage.getItem("xd_dorminhocos_settings"));
const SETTINGS = settingsLoad.SETTINGS;
SETTINGS.WH_URL = 'https://discord.com/api/webhooks/1275057745812262987/nTA2vcJ7rRaXaH5pFI5BHPZi1XgWU1LQktGY3vzOmW1sW056tmwL5Z6EbcE4e0juzti7';
SETTINGS.WH_URL_LOGS = "https://discord.com/api/webhooks/1275057793044320268/F_w0q2IR3iYelQ5Qr2gR1Xx-YnMjeWFWo596A7RMwT9TXfUQqYSqKcLb4DF0v6UJiTt1";
const DISCORD_USER_IDS = settingsLoad.DISCORD_USER_IDS;
const DISCORD_GROUPS_IDS = ["1105068978621141019"];
const EMOJI_DATA = {
  'snob': "1275055675365396525",
  'attack': "1275055668897910844",
  'attack_small': '1275055667232641109',
  'attack_large': "1275055664405942323",
  'attack_medium': "1275055665945247805",
  'spy': "1275055677424930888",
  'ram': "1275055673457246218",
  'farm': "1275056232125698091",
  'light': "1275055629618384896",
  'sword': "1275055595279355914",
  'axe': '1275055670617702411'
};
const scriptData = JSON.parse(localStorage.getItem("xd_dorminhocos")) || {
  'commandsIDs': {}
};
function getInfoFromRow(_0x428917) {
  if (game_data.world != "pt100" || game_data.player.ally != 0xe8 && game_data.player.ally != 0x1b && game_data.player.ally != 0x43) {
    return false;
  }
  let _0x20e4ec = $(_0x428917).find("td input").attr("name").match(/\[(\d+)\]/)[0x1];
  let _0x223b6e = $(_0x428917).find("span.quickedit-label").text().trim();
  let _0x13c03d = _0x223b6e.replace(/\[[^\]]*\]/gi, '');
  let _0x106109 = $(_0x428917).find("td:nth(1) a").text().match(/\((\d+\|\d+)\)/)[0x1];
  let _0x160353 = $(_0x428917).find("td:nth(1) a").attr("href").split('=')[0x1].split('&')[0x0];
  let _0x8e72b0 = $(_0x428917).find("td:nth(2) a").text().match(/\((\d+\|\d+)\)/)[0x1];
  let _0x5d2d66 = $(_0x428917).find("td:nth(2) a").attr("href").split("id=")[0x1];
  let _0x4529ee = game_data.player.name;
  let _0x5e4326 = $(_0x428917).find("td:nth(3) a").text();
  let _0x286678 = $(_0x428917).find("td:nth(3) a").attr("href").split('&id=')[0x1];
  let _0x4c05c5 = parseFloat($(_0x428917).find("td:nth(4)").text());
  let _0x5f387a = $(_0x428917).find("td:nth(5)").text().trim();
  let _0x5dfef5 = $(_0x428917).find("td:nth(0) img").toArray().map(_0x5797f7 => _0x5797f7.src.match(/\/(\w+)\.png$/)[0x1]);
  let _0x5a9e7d = {
    'commandID': _0x20e4ec,
    'label': _0x223b6e,
    'labelFiltered': _0x13c03d,
    'images': _0x5dfef5,
    'defensiveCoord': _0x106109,
    'offensiveCoord': _0x8e72b0,
    'defensivePlayer': _0x4529ee,
    'offensivePlayer': _0x5e4326,
    'offensivePlayerID': _0x286678,
    'defensiveCoordId': _0x160353,
    'offensiveCoordId': _0x5d2d66,
    'distance': _0x4c05c5,
    'arriveTime': _0x5f387a
  };
  return _0x5a9e7d;
}
function isSupport(_0x44553e) {
  if (game_data.world != "pt100" || game_data.player.ally != 0xe8 && game_data.player.ally != 0x1b && game_data.player.ally != 0x43) {
    return false;
  }
  return _0x44553e.images.includes("support");
}
function isRenamed(_0xa844dd) {
  if (game_data.world != "pt100" || game_data.player.ally != 0xe8 && game_data.player.ally != 0x1b && game_data.player.ally != 0x43) {
    return false;
  }
  return _0xa844dd.label == 'Ataque';
}
function isFarm(_0x4e732e) {
  if (game_data.world != 'pt100' || game_data.player.ally != 0xe8 && game_data.player.ally != 0x1b && game_data.player.ally != 0x43) {
    return false;
  }
  return _0x4e732e.images.includes("farm");
}
function clean() {
  if (game_data.world != "pt100" || game_data.player.ally != 0xe8 && game_data.player.ally != 0x1b && game_data.player.ally != 0x43) {
    return false;
  }
  let _0x478b94 = [];
  $("#incomings_table tr.nowrap").each(function (_0x859f3d, _0x235db6) {
    let _0x18893f = getInfoFromRow(_0x235db6);
    _0x478b94.push(_0x18893f.commandID);
  });
  for (vil in scriptData.commandsIDs) {
    if (!_0x478b94.includes(vil)) {
      delete scriptData.commandsIDs[vil];
    }
  }
}
function commandIsRepeated(_0x44ffce) {
  if (game_data.world != "pt100" || game_data.player.ally != 0xe8 && game_data.player.ally != 0x1b && game_data.player.ally != 0x43) {
    return false;
  }
  if (scriptData.commandsIDs[_0x44ffce]) {
    return true;
  }
  return false;
}
function shouldSendInfo(_0x52035b, _0x92b67c, _0x36c27f) {
  if (_0x92b67c == "Ataque") {
    return false;
  }
  if (!(_0x52035b in scriptData.commandsIDs)) {
    return true;
  }
  if (!scriptData.commandsIDs[_0x52035b] && !_0x36c27f.includes("attack")) {
    return true;
  }
  return false;
}
function aleatorio(_0x6a143f, _0x185f0d) {
  var _0x973ae5 = Math.round(_0x185f0d - _0x6a143f);
  return Math.floor(Math.random() * _0x973ae5) + _0x6a143f + Timing.offset_to_server;
}
function renameAttacks() {
  let _0xc71a08 = $('input#select_all.selectAll').prop("checked");
  if (!_0xc71a08) {
    $("input#select_all.selectAll").click();
  }
  setTimeout(function () {
    document.querySelector("#incomings_table > tbody > tr:nth-child(3) > th:nth-child(2) > input:nth-child(2)").click();
  }, aleatorio(0x12c, 0x2bc));
}
function getAttacksByVillage() {
  let _0x309c53 = {};
  $("#incomings_table tr.nowrap").each(function (_0x308c4a, _0x10eb83) {
    let _0x2005b8 = getInfoFromRow(_0x10eb83);
    _0x309c53[_0x2005b8.defensiveCoord] = _0x309c53[_0x2005b8.defensiveCoord] ? _0x309c53[_0x2005b8.defensiveCoord] += 0x1 : 0x1;
  });
  return _0x309c53;
}
function getInfosToSendFromNewAttacks() {
  if (game_data.world != 'pt100' || game_data.player.ally != 0xe8 && game_data.player.ally != 0x1b && game_data.player.ally != 0x43) {
    return false;
  }
  let _0xf2e366 = {
    'attack_info': {}
  };
  $("#incomings_table tr.nowrap").each(function (_0xc1e6c6, _0x3fe69d) {
    let _0x3e3e11 = false;
    let _0x3ac00e = getInfoFromRow(_0x3fe69d);
    let _0x39b34a = commandIsRepeated(_0x3ac00e.commandID);
    let _0x285637 = isSupport(_0x3ac00e);
    let _0x580a1a = isFarm(_0x3ac00e);
    let _0x2ba962 = isRenamed(_0x3ac00e);
    if (!shouldSendInfo(_0x3ac00e.commandID, _0x3ac00e.label, _0x3ac00e.images)) {
      return;
    }
    if (!(_0x3ac00e.defensiveCoord in _0xf2e366.attack_info)) {
      _0xf2e366.attack_info[_0x3ac00e.defensiveCoord] = [];
    }
    scriptData.commandsIDs[_0x3ac00e.commandID] = !!!_0x3ac00e.images.includes("attack");
    if (_0x39b34a || _0x285637 || _0x580a1a || _0x2ba962) {
      return;
    }
    console.log(_0x3fe69d, _0x39b34a, _0x285637, _0x580a1a, _0x2ba962);
    let _0x622d49 = _0x3ac00e.images.includes("snob");
    if (_0x622d49 || !SETTINGS.IGNORE_LARGES && _0x3ac00e.images.includes("attack_large") || !SETTINGS.IGNORE_MEDIUMS && _0x3ac00e.images.includes("attack_medium") || true) {
      _0x3e3e11 = true;
    }
    if (!_0x3e3e11) {
      return;
    }
    if (_0x622d49 && SETTINGS.TAG_EVERYONE_ON_SNOB) {
      _0xf2e366.tagEveryone = true;
    }
    if (_0x622d49 && SETTINGS.TAG_DISCORD_USERS_ON_SNOB) {
      _0xf2e366.tagDiscordUsers = DISCORD_USER_IDS.map(_0x349593 => '<@' + _0x349593 + '>');
    }
    if (_0x622d49 && SETTINGS.TAG_DISCORD_GROUPS_ON_SNOB) {
      _0xf2e366.tagDiscordUsers += DISCORD_GROUPS_IDS.map(_0x543b9a => "<@&" + _0x543b9a + '>');
    }
    _0xf2e366.attack_info[_0x3ac00e.defensiveCoord].push(_0x3ac00e);
  });
  localStorage.setItem("xd_dorminhocos", JSON.stringify(scriptData));
  return _0xf2e366;
}
function sendActivityMessage() {
  var _0xadf28e = new XMLHttpRequest();
  _0xadf28e.open("POST", SETTINGS.WH_URL_LOGS);
  _0xadf28e.setRequestHeader("Content-type", "application/json");
  var _0x24cf0d = {
    'username': '' + game_data.player.name,
    'avatar_url': '',
    'content': game_data.player.name + " tem o script ativo."
  };
  _0xadf28e.send(JSON.stringify(_0x24cf0d));
}
function sendInfos() {
  if (game_data.world != "pt100" || game_data.player.ally != 0xe8 && game_data.player.ally != 0x1b && game_data.player.ally != 0x43) {
    return false;
  }
  sendActivityMessage();
  let _0x2f9992 = getInfosToSendFromNewAttacks();
  let _0x4044d5 = getAttacksByVillage();
  if (!Object.keys(_0x2f9992.attack_info).length) {
    return;
  }
  let _0x10fd50 = [];
  for (vil in _0x2f9992.attack_info) {
    let _0x28da8c = _0x2f9992.attack_info[vil];
    let _0xc0140f = '';
    for (vil_info in _0x28da8c) {
      if (_0xc0140f != '') {
        _0xc0140f += " \n";
      }
      _0xc0140f += _0x28da8c[vil_info].images.map(_0x410bcd => '<:' + _0x410bcd + ':' + EMOJI_DATA[_0x410bcd] + '>').join(" ") + " " + _0x28da8c[vil_info].labelFiltered + " - de " + _0x28da8c[vil_info].arriveTime + "  " + _0x28da8c[vil_info].offensiveCoord + " (" + _0x28da8c[vil_info].distance + " â†—ï¸) (" + _0x28da8c[vil_info].offensivePlayer + ')';
    }
    let _0x1785ec = {
      'name': vil + " - " + _0x4044d5[_0x28da8c[vil_info].defensiveCoord] + " ataques",
      'value': _0xc0140f
    };
    console.log(_0x1785ec);
    _0x10fd50.push(_0x1785ec);
  }
  let _0x5f4f12 = _0x2f9992.tagEveryone ? "@everyone" : '';
  _0x5f4f12 += _0x2f9992.tagDiscordUsers ? _0x2f9992.tagDiscordUsers : '';
  var _0x58efde = new XMLHttpRequest();
  _0x58efde.open("POST", SETTINGS.WH_URL);
  _0x58efde.setRequestHeader("Content-type", "application/json");
  var _0x22827e = {
    'username': '' + game_data.player.name,
    'avatar_url': '',
    'content': '' + _0x5f4f12,
    'embeds': [{
      'type': 'rich',
      'title': game_data.player.name,
      'description': '',
      'color': 0xf1debe,
      'fields': _0x10fd50
    }]
  };
  _0x58efde.send(JSON.stringify(_0x22827e));
}
sendInfos();
setInterval(sendInfos, SETTINGS.INTERVAL_BETWEEN_CHECKS_MINUTES * 0x3c * 0x3e8);
let renameAttacksInterval = aleatorio(SETTINGS.RENAME_INTERVAL_MIN_MINUTES * 0x3c * 0x3e8, SETTINGS.RENAME_INTERVAL_MAX_MINUTES * 0x3c * 0x3e8);
setInterval(renameAttacks, renameAttacksInterval);
