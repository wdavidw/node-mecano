// Generated by CoffeeScript 2.6.1
var utils;

utils = require('@nikitajs/core/lib/utils');

module.exports = {
  parse: function(str) {
    var current_controller_name, current_default, current_group, current_group_controller, current_group_name, current_group_perm, current_group_perm_content, current_group_section, current_group_section_perm_name, current_mount, current_mount_section, lines, list_of_group_sections, list_of_mount_sections;
    lines = utils.string.lines(str);
    list_of_mount_sections = [];
    list_of_group_sections = {};
    // variable which hold the cursor position
    current_mount = false;
    current_group = false;
    current_group_name = '';
    current_group_controller = false;
    current_group_perm = false;
    current_group_perm_content = false;
    current_default = false;
    // variables which hold the data
    current_mount_section = null;
    current_group_section = null; // group section is a tree but only of group
    current_controller_name = null;
    current_group_section_perm_name = null;
    lines.forEach(function(line, _, __) {
      var base, base1, match, match_admin, name, name1, name2, name3, name4, sep, type, value;
      if (!line || line.match(/^\s*$/)) {
        return;
      }
      if (!current_mount && !current_group && !current_default) {
        if (/^mount\s{$/.test(line)) { // start of a mount object
          current_mount = true;
          current_mount_section = [];
        }
        if (/^(group)\s([A-z|0-9|\/]*)\s{$/.test(line)) { // start of a group object
          current_group = true;
          match = /^(group)\s([A-z|0-9|\/]*)\s{$/.exec(line);
          current_group_name = match[2];
          current_group_section = {};
          if (list_of_group_sections[name1 = `${current_group_name}`] == null) {
            list_of_group_sections[name1] = {};
          }
        }
        if (/^(default)\s{$/.test(line)) { // start of a special group object named default
          current_group = true;
          current_group_name = '';
          current_group_section = {};
          return list_of_group_sections[name2 = `${current_group_name}`] != null ? list_of_group_sections[name2] : list_of_group_sections[name2] = {};
        }
      } else {
        // we are parsing a mount object
        // ^(cpuset|cpu|cpuacct|memory|devices|freezer|net_cls|blkio)\s=\s[aA-zZ|\s]*
        if (current_mount) {
          if (/^}$/.test(line)) { // close the mount object
            list_of_mount_sections.push(...current_mount_section);
            current_mount = false;
            current_mount_section = [];
          } else {
            // add the line to mont object
            line = line.replace(';', '');
            sep = '=';
            if (line.indexOf(':') !== -1) {
              sep = ':';
            }
            line = line.split(sep);
            current_mount_section.push({
              type: `${line[0].trim()}`,
              path: `${line[1].trim()}`
            });
          }
        }
        // we are parsing a group object
        // ^(cpuset|cpu|cpuacct|memory|devices|freezer|net_cls|blkio)\s=\s[aA-zZ|\s]*
        if (current_group) {
          // if a closing bracket is encountered, it should set the cursor to false
          if (/^(\s*)?}$/.test(line)) {
            if (current_group) {
              if (current_group_controller) {
                return current_group_controller = false;
              } else if (current_group_perm) {
                if (current_group_perm_content) {
                  return current_group_perm_content = false;
                } else {
                  return current_group_perm = false;
                }
              } else {
                current_group = false;
                // push the group if the closing bracket is closing a group
                // list_of_group_sections["#{current_group_name}"] = current_group_section
                return current_group_section = null;
              }
            }
          } else {
            //closing the group object
            match = /^\s*(cpuset|cpu|cpuacct|blkio|memory|devices|freezer|net_cls|perf_event|net_prio|hugetlb|pids|rdma)\s{$/.exec(line);
            if (!current_group_perm && !current_group_controller) {
              //if neither working in perm or controller section, we are declaring one of them
              if (/^\s*perm\s{$/.test(line)) { // perm declaration
                current_group_perm = true;
                current_group_section['perm'] = {};
                list_of_group_sections[`${current_group_name}`]['perm'] = {};
              }
              if (match) { //controller declaration
                current_group_controller = true;
                current_controller_name = match[1];
                current_group_section[`${current_controller_name}`] = {};
                return (base = list_of_group_sections[`${current_group_name}`])[name3 = `${current_controller_name}`] != null ? base[name3] : base[name3] = {};
              }
            } else if (current_group_perm && current_group_perm_content) { // perm config
              line = line.replace(';', '');
              line = line.split('=');
              [type, value] = line;
              current_group_section['perm'][current_group_section_perm_name][type.trim()] = value.trim();
              return list_of_group_sections[`${current_group_name}`]['perm'][current_group_section_perm_name][type.trim()] = value.trim();
            } else if (current_group_controller) { // controller config
              line = line.replace(';', '');
              sep = '=';
              if (line.indexOf(':') !== -1) {
                sep = ':';
              }
              line = line.split(sep);
              [type, value] = line;
              return (base1 = list_of_group_sections[`${current_group_name}`][`${current_controller_name}`])[name4 = type.trim()] != null ? base1[name4] : base1[name4] = value.trim();
            } else {
              match_admin = /^\s*(admin|task)\s{$/.exec(line);
              if (match_admin) { // admin or task declaration
                [_, name] = match_admin; //the name is either admin or task
                current_group_perm_content = true;
                current_group_section_perm_name = name;
                current_group_section['perm'][name] = {};
                return list_of_group_sections[`${current_group_name}`]['perm'][name] = {};
              }
            }
          }
        }
      }
    });
    return {
      mounts: list_of_mount_sections,
      groups: list_of_group_sections
    };
  },
  stringify: function(obj, config = {}) {
    var count, group, group_render, i, indent, j, k, key, l, len, mount, mount_render, name, prop, ref, ref1, ref2, ref3, ref4, render, sections, val, value;
    if (obj.mounts == null) {
      obj.mounts = [];
    }
    if (obj.groups == null) {
      obj.groups = {};
    }
    render = "";
    if (config.indent == null) {
      config.indent = 2;
    }
    indent = '';
    for (i = j = 1, ref = config.indent; (1 <= ref ? j <= ref : j >= ref); i = 1 <= ref ? ++j : --j) {
      indent += ' ';
    }
    sections = [];
    if (obj.mounts.length !== 0) {
      mount_render = "mount {\n";
      ref1 = obj.mounts;
      for (k = l = 0, len = ref1.length; l < len; k = ++l) {
        mount = ref1[k];
        mount_render += `${indent}${mount.type} = ${mount.path};\n`;
      }
      mount_render += '}';
      sections.push(mount_render);
    }
    count = 0;
    ref2 = obj.groups;
    for (name in ref2) {
      group = ref2[name];
      group_render = (name === '') || (name === 'default') ? 'default {\n' : `group ${name} {\n`;
      for (key in group) {
        value = group[key];
        if (key === 'perm') {
          group_render += `${indent}perm {\n`;
          if (value['admin'] != null) {
            group_render += `${indent}${indent}admin {\n`;
            ref3 = value['admin'];
            for (prop in ref3) {
              val = ref3[prop];
              group_render += `${indent}${indent}${indent}${prop} = ${val};\n`;
            }
            group_render += `${indent}${indent}}\n`;
          }
          if (value['task'] != null) {
            group_render += `${indent}${indent}task {\n`;
            ref4 = value['task'];
            for (prop in ref4) {
              val = ref4[prop];
              group_render += `${indent}${indent}${indent}${prop} = ${val};\n`;
            }
            group_render += `${indent}${indent}}\n`;
          }
          group_render += `${indent}}\n`;
        } else {
          group_render += `${indent}${key} {\n`;
          for (prop in value) {
            val = value[prop];
            group_render += `${indent}${indent}${prop} = ${val};\n`;
          }
          group_render += `${indent}}\n`;
        }
      }
      group_render += '}';
      count++;
      sections.push(group_render);
    }
    return sections.join("\n");
  }
};
