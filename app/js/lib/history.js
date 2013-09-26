/*global chrome, define, _*/
define(function(require, exports, module) {

    var MAX_RECENT_PROJECTS = 5;

    return {
        pushProject: function(name, url) {
            chrome.storage.local.get("recentProjects", function(results) {
                var projects = results.recentProjects || [];
                // sanity check projects array
                if (projects.length > 0 && !projects[0].url) {
                    projects = [];
                }
                var existing = _.where(projects, {
                    url: url
                });
                if (existing.length === 0) {
                    projects.splice(0, 0, {
                        name: name,
                        url: url
                    });
                    if (projects.length > MAX_RECENT_PROJECTS) {
                        projects.splice(projects.length - 1, 1);
                    }
                } else {
                    projects.splice(projects.indexOf(existing[0]), 1);
                    projects.splice(0, 0, {
                        name: name,
                        url: url
                    });
                }
                chrome.storage.local.set({
                    recentProjects: projects
                });
            });
        },
        getProjects: function(callback) {
            chrome.storage.local.get("recentProjects", function(results) {
                var projects = results.recentProjects || [];
                // sanity check projects array
                if (projects.length > 0 && !projects[0].url) {
                    projects = [];
                }
                _.each(projects, function(project) {
                    project.name = project.name || project.url.replace("http://localhost:7336/fs/local/", "");
                });
                callback(null, projects);
            });
        }
    };
});