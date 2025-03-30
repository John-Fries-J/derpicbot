const { roles } = require('../config.json');

module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
        const roleIds = [
            roles.autoRoleId,
            roles.autoRoleId1,
            roles.autoRoleId2,
            roles.autoRoleId3
        ];

        roleIds.forEach(roleId => {
            if (member.roles.cache.has(roleId)) {
                console.log(`User: ${member.user.tag} already has the role: ${roleId}`);
            } else {
                member.roles.add(roleId)
                    .then(() => console.log(`Added role: ${roleId} to user: ${member.user.tag}`))
                    .catch(err => console.log(`Failed to add role: ${roleId} to user: ${member.user.tag} - Error: ${err}`));
            }
        });
    },
};
