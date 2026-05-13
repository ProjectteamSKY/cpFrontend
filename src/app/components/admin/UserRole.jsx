import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    fetchRoles,
    fetchResources,
    fetchPermissions,
    fetchRolePermissions,
    assignPermission,
    removePermission
} from '../../service/UserRolePermissionService';

const ACTION_ORDER = ['create', 'read', 'update', 'delete', 'approve', 'reject'];

const formatRoleLabel = (name) =>
    name
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^(admin)([a-z])/i, 'Admin $2')
        .replace(/^(club)([a-z])/i, 'Club $2')
        .replace(/\b\w/g, c => c.toUpperCase());

const buildResourceTree = (resources, permsRaw) => {
    const seen = new Set();
    const deduped = [];
    [...permsRaw].sort((a, b) => a.id - b.id).forEach(p => {
        const key = `${p.resource_id}::${p.action}`;
        if (!seen.has(key)) { seen.add(key); deduped.push(p); }
    });

    const byResource = {};
    deduped.forEach(p => {
        if (!byResource[p.resource_id]) byResource[p.resource_id] = [];
        byResource[p.resource_id].push(p);
    });

    Object.values(byResource).forEach(arr =>
        arr.sort((a, b) => {
            const ai = ACTION_ORDER.indexOf(a.action);
            const bi = ACTION_ORDER.indexOf(b.action);
            return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
        })
    );

    return resources
        .filter(r => byResource[r.id])
        .sort((a, b) => a.id - b.id)
        .map(r => ({ ...r, actions: byResource[r.id] }));
};

const UserRole = () => {
    const navigate = useNavigate();
    const [apiRoles, setApiRoles] = useState([]);
    const [resources, setResources] = useState([]);
    const [allPermIds, setAllPermIds] = useState([]);
    const [rolePerms, setRolePerms] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [popup, setPopup] = useState({ open: false, message: '', type: 'success' });
    const [expandedResources, setExpandedResources] = useState({});
    const [activeRoleIdx, setActiveRoleIdx] = useState(0);
    const [userRoles, setUserRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserRolesModal, setShowUserRolesModal] = useState(false);
    const [expandedUsers, setExpandedUsers] = useState({});

    const savedPerms = React.useRef({});

    // Fetch user roles from the API
    const fetchUserRoles = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/user_role/list');
            const data = await response.json();
            if (data.status === 'success') {
                setUserRoles(data.user_roles);
            }
        } catch (err) {
            console.error('Error fetching user roles:', err);
        }
    };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                setError(null);

                const [
                    rolesData,
                    resourcesData,
                    permsData,
                    rolePermsData
                ] = await Promise.all([
                    fetchRoles(),
                    fetchResources(),
                    fetchPermissions(),
                    fetchRolePermissions(),
                ]);

                await fetchUserRoles();

                console.log('Fetched roles:', rolesData);
                console.log('Fetched resources:', resourcesData);
                console.log('Fetched permissions:', permsData);
                console.log('Fetched role permissions:', rolePermsData);

                const sortedRoles = Array.isArray(rolesData)
                    ? [...rolesData].sort((a, b) => a.name.localeCompare(b.name))
                    : [];

                const tree = buildResourceTree(resourcesData, permsData);

                const permIds = tree.flatMap(r => r.actions.map(a => a.id));

                const initialExpandedState = {};
                tree.forEach(resource => {
                    initialExpandedState[resource.id] = true;
                });
                setExpandedResources(initialExpandedState);

                const perms = {};
                sortedRoles.forEach(role => {
                    perms[role.name] = {};
                    permIds.forEach(id => {
                        perms[role.name][id] = false;
                    });
                });

                const permIdSetByRole = {};

                rolePermsData.forEach(({ role_id, permission_id }) => {
                    if (!permIdSetByRole[role_id]) {
                        permIdSetByRole[role_id] = new Set();
                    }
                    permIdSetByRole[role_id].add(permission_id);
                });

                sortedRoles.forEach(role => {
                    const assigned = permIdSetByRole[role.id] || new Set();
                    permIds.forEach(id => {
                        perms[role.name][id] = assigned.has(id);
                    });
                });

                savedPerms.current = JSON.parse(JSON.stringify(perms));

                setApiRoles(sortedRoles);
                setResources(tree);
                setAllPermIds(permIds);
                setRolePerms(perms);

            } catch (err) {
                console.error("RBAC Fetch Error:", err);
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const toggle = (roleName, permId) =>
        setRolePerms(prev => ({
            ...prev,
            [roleName]: { ...prev[roleName], [permId]: !prev[roleName][permId] },
        }));

    const toggleResource = (roleName, permIds, select) =>
        setRolePerms(prev => ({
            ...prev,
            [roleName]: { ...prev[roleName], ...Object.fromEntries(permIds.map(id => [id, select])) },
        }));

    const toggleAll = (roleName, select) =>
        setRolePerms(prev => ({
            ...prev,
            [roleName]: Object.fromEntries(allPermIds.map(id => [id, select])),
        }));

    const countEnabled = (roleName) => Object.values(rolePerms[roleName] ?? {}).filter(Boolean).length;
    const isAllOn = (roleName) => countEnabled(roleName) === allPermIds.length;

    const toggleResourceExpansion = (resourceId) => {
        setExpandedResources(prev => ({ ...prev, [resourceId]: !prev[resourceId] }));
    };

    const toggleUserExpansion = (userId) => {
        setExpandedUsers(prev => ({ ...prev, [userId]: !prev[userId] }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const requests = [];
            apiRoles.forEach(role => {
                const current = rolePerms[role.name] ?? {};
                const original = savedPerms.current[role.name] ?? {};
                Object.entries(current).forEach(([permId, checked]) => {
                    const wasChecked = original[permId] ?? false;
                    if (checked && !wasChecked) requests.push(assignPermission(role.id, permId));
                    else if (!checked && wasChecked) requests.push(removePermission(role.id, permId));
                });
            });

            if (requests.length === 0) {
                setPopup({ open: true, message: 'No changes to save.', type: 'success' });
                setTimeout(() => setPopup({ open: false, message: '', type: 'success' }), 3000);
                return;
            }

            await Promise.all(requests);
            savedPerms.current = JSON.parse(JSON.stringify(rolePerms));
            setPopup({ open: true, message: 'Role permissions saved successfully!', type: 'success' });
            setTimeout(() => setPopup({ open: false, message: '', type: 'success' }), 3000);
        } catch (err) {
            setPopup({ open: true, message: 'Failed to save: ' + err.message, type: 'error' });
            setTimeout(() => setPopup({ open: false, message: '', type: 'error' }), 3000);
        } finally {
            setSaving(false);
        }
    };

    const handleAddRole = () => navigate('/admin/add-role');
    const handleAddResourcesActions = () => navigate('/admin/resources-actions');
    
    const handleViewUserRoles = (user) => {
        const userRolesList = userRoles.filter(ur => ur.user_id === user.id);
        setSelectedUser({ ...user, roles: userRolesList });
        setShowUserRolesModal(true);
    };

    const getUserRolesForDisplay = () => {
        const userMap = new Map();
        userRoles.forEach(ur => {
            if (!userMap.has(ur.user_id)) {
                userMap.set(ur.user_id, {
                    id: ur.user_id,
                    name: ur.user_name,
                    email: ur.user_email,
                    roles: []
                });
            }
            userMap.get(ur.user_id).roles.push({
                id: ur.role_id,
                name: ur.role_name,
                description: ur.role_description,
                assigned_at: ur.assigned_at,
                assigned_by: ur.assigned_by_name,
                assigned_by_id: ur.assigned_by
            });
        });
        return Array.from(userMap.values());
    };

    if (error) return (
        <div className="p-6 min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="p-5 bg-red-50 border border-red-200 rounded-xl text-center max-w-md">
                <p className="text-red-600 font-medium mb-1">Failed to load data</p>
                <p className="text-red-500 text-sm mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 border border-red-300 text-red-700 rounded-lg text-sm transition-colors"
                >
                    Retry
                </button>
            </div>
        </div>
    );

    const colTemplate = `220px repeat(${apiRoles.length}, 1fr)`;
    const activeRole = apiRoles[activeRoleIdx];
    const usersWithRoles = getUserRolesForDisplay();

    return (
        <div className="p-3 sm:p-4 md:p-6 min-h-screen bg-white">
            <div className="max-w-full mx-auto">

                {/* Header */}
                <div className="mb-5 md:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 text-gray-900">
                            User Role Permissions
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500">
                            Manage access permissions for each role across all resources
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                        <button
                            onClick={handleAddRole}
                            className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                        >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            <span>Add Role</span>
                        </button>
                        <button
                            onClick={handleAddResourcesActions}
                            className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                        >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Add Resources & Actions</span>
                        </button>
                    </div>
                </div>

                {/* User Role Assignments Section - Table Format */}
                <div className="mb-8 border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                    <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                        <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#D73D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            User Role Assignments
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr className="border-b border-gray-200">
                                    <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 w-1/4">
                                        User
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Assigned Roles
                                    </th>
                                   
                                </tr>
                            </thead>
                            <tbody>
                                {usersWithRoles.map((user, idx) => {
                                    const isExpanded = expandedUsers[user.id];
                                    return (
                                        <React.Fragment key={user.id}>
                                            <tr className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{user.name}</div>
                                                        <div className="text-xs text-gray-500">{user.email}</div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.roles.slice(0, 3).map((role, roleIdx) => (
                                                            <span key={roleIdx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                                                {formatRoleLabel(role.name)}
                                                            </span>
                                                        ))}
                                                        {/* {user.roles.length > 3 && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                                                +{user.roles.length - 3} more
                                                            </span>
                                                        )} */}
                                                        {user.roles.length === 0 && (
                                                            <span className="text-xs text-gray-400">No roles assigned</span>
                                                        )}
                                                    </div>
                                                </td>
                                                {/* <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => handleViewUserRoles(user)}
                                                        className="text-xs px-3 py-1.5 rounded-lg transition-colors bg-[#D73D32] hover:bg-[#C2352A] text-white font-medium"
                                                    >
                                                        View Details
                                                    </button>
                                                </td> */}
                                            </tr>
                                            {isExpanded && (
                                                <tr className="bg-gray-50">
                                                    <td colSpan="3" className="px-4 py-3">
                                                        <div className="space-y-2">
                                                            <div className="text-xs font-medium text-gray-700 mb-2">All Roles:</div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {user.roles.map((role, roleIdx) => (
                                                                    <div key={roleIdx} className="bg-white border border-gray-200 rounded-lg p-2 inline-block">
                                                                        <span className="text-sm font-medium text-[#D73D32]">{formatRoleLabel(role.name)}</span>
                                                                        {role.description && (
                                                                            <span className="text-xs text-gray-500 ml-2">({role.description})</span>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {usersWithRoles.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No user role assignments found
                        </div>
                    )}
                </div>

                {/* Desktop Table */}
                <div className="hidden lg:block border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                    <div className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200">
                        <div className="grid items-center px-4 py-3" style={{ gridTemplateColumns: colTemplate }}>
                            <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                Resource / Action
                            </div>
                            {apiRoles.map((role) => (
                                <div key={role.id} className="text-center px-1">
                                    <div className="text-sm font-semibold text-[#D73D32]">
                                        {role.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        {resources.map((resource) => {
                            const resourcePermIds = resource.actions.map(a => a.id);
                            const isExpanded = expandedResources[resource.id] !== false;

                            return (
                                <div key={resource.id}>
                                    <div
                                        className="grid items-center px-4 py-2.5 border-b cursor-pointer hover:bg-gray-50 transition-colors bg-gray-50/50"
                                        style={{
                                            gridTemplateColumns: colTemplate,
                                            borderColor: '#e5e7eb'
                                        }}
                                        onClick={() => toggleResourceExpansion(resource.id)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs w-4 flex-shrink-0 text-gray-400">
                                                {isExpanded ? '▼' : '▶'}
                                            </span>
                                            <span className="font-semibold text-sm text-gray-900">
                                                {resource.name.trim()}
                                            </span>
                                        </div>
                                        {apiRoles.map((role) => {
                                            const allOn = resourcePermIds.every(id => rolePerms[role.name]?.[id]);
                                            return (
                                                <div key={role.id} className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => toggleResource(role.name, resourcePermIds, !allOn)}
                                                        className="text-[10px] px-2 py-0.5 rounded transition-colors font-medium"
                                                        style={allOn
                                                            ? { color: '#dc2626', backgroundColor: '#fee2e2' }
                                                            : { color: '#9ca3af', backgroundColor: '#f3f4f6' }
                                                        }
                                                    >
                                                        {allOn ? '✓ all' : '— all'}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {isExpanded && resource.actions.map((perm, aIdx) => {
                                        const isLast = aIdx === resource.actions.length - 1;
                                        return (
                                            <div
                                                key={perm.id}
                                                className="grid items-center px-4 py-2 hover:bg-gray-50 transition-colors border-b"
                                                style={{
                                                    gridTemplateColumns: colTemplate,
                                                    borderColor: isLast ? '#e5e7eb' : '#f3f4f6'
                                                }}
                                            >
                                                <div className="pl-10">
                                                    <span className="text-sm capitalize text-gray-600">
                                                        {perm.action}
                                                    </span>
                                                </div>
                                                {apiRoles.map((role) => {
                                                    const checked = rolePerms[role.name]?.[perm.id] ?? false;
                                                    return (
                                                        <div key={role.id} className="flex justify-center">
                                                            <button
                                                                onClick={() => toggle(role.name, perm.id)}
                                                                className="w-5 h-5 rounded transition-all"
                                                                style={checked
                                                                    ? { backgroundColor: '#dc2626', border: '2px solid #dc2626', boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)' }
                                                                    : { backgroundColor: '#ffffff', border: '2px solid #d1d5db' }
                                                                }
                                                            >
                                                                {checked && (
                                                                    <svg className="w-full h-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#ffffff' }}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile View */}
                <div className="lg:hidden">
                    {/* Role tab switcher */}
                    <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
                        {apiRoles.map((role, idx) => {
                            const enabled = countEnabled(role.name);
                            const total = allPermIds.length;
                            const isActive = activeRoleIdx === idx;
                            return (
                                <button
                                    key={role.id}
                                    onClick={() => setActiveRoleIdx(idx)}
                                    className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                                        isActive
                                            ? 'bg-[#D73D32] text-white border-[#D73D32]'
                                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {formatRoleLabel(role.name)}
                                    <span className="ml-1.5 opacity-70">({enabled}/{total})</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Single active role card */}
                    {activeRole && (
                        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                            {/* Card header */}
                            <div className="border-b p-4 flex items-center justify-between bg-gray-50 border-gray-200">
                                <span className="text-base font-semibold text-[#D73D32]">
                                    {formatRoleLabel(activeRole.name)}
                                </span>
                                <button
                                    onClick={() => toggleAll(activeRole.name, !isAllOn(activeRole.name))}
                                    className="text-xs px-3 py-1.5 rounded-lg transition-colors border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                >
                                    {isAllOn(activeRole.name) ? 'Deselect All' : 'Select All'}
                                </button>
                            </div>

                            {/* Resources list */}
                            <div className="divide-y divide-gray-100">
                                {resources.map((resource) => {
                                    const rIds = resource.actions.map(a => a.id);
                                    const allR = rIds.every(id => rolePerms[activeRole.name]?.[id]);
                                    const isExpanded = expandedResources[resource.id] !== false;

                                    return (
                                        <div key={resource.id}>
                                            {/* Resource row */}
                                            <div
                                                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors bg-gray-50/30"
                                                onClick={() => toggleResourceExpansion(resource.id)}
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="text-xs flex-shrink-0 text-gray-400">
                                                        {isExpanded ? '▼' : '▶'}
                                                    </span>
                                                    <span className="text-sm font-semibold truncate text-gray-900">
                                                        {resource.name.trim()}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleResource(activeRole.name, rIds, !allR);
                                                    }}
                                                    className="flex-shrink-0 ml-2 text-[10px] px-2 py-1 rounded transition-colors font-medium"
                                                    style={allR
                                                        ? { color: '#dc2626', backgroundColor: '#fee2e2' }
                                                        : { color: '#6b7280', backgroundColor: '#f3f4f6' }
                                                    }
                                                >
                                                    {allR ? '✓ all' : 'toggle all'}
                                                </button>
                                            </div>

                                            {/* Action rows */}
                                            {isExpanded && (
                                                <div className="px-4 pb-3 space-y-1">
                                                    {resource.actions.map((perm) => {
                                                        const checked = rolePerms[activeRole.name]?.[perm.id] ?? false;
                                                        return (
                                                            <div
                                                                key={perm.id}
                                                                className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50"
                                                            >
                                                                <span className="text-sm capitalize text-gray-600">
                                                                    {perm.action}
                                                                </span>
                                                                <button
                                                                    onClick={() => toggle(activeRole.name, perm.id)}
                                                                    className="w-6 h-6 rounded transition-all flex-shrink-0"
                                                                    style={checked
                                                                        ? { backgroundColor: '#dc2626', border: '2px solid #dc2626', boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.1)' }
                                                                        : { backgroundColor: '#ffffff', border: '2px solid #d1d5db' }
                                                                    }
                                                                >
                                                                    {checked && (
                                                                        <svg className="w-full h-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#ffffff' }}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Progress bar */}
                            <div className="border-t p-4 bg-gray-50 border-gray-200">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-500">Permissions enabled</span>
                                    <span className="font-semibold text-gray-900">
                                        {countEnabled(activeRole.name)}/{allPermIds.length}
                                    </span>
                                </div>
                                <div className="w-full rounded-full h-1.5 bg-gray-200">
                                    <div
                                        className="h-1.5 rounded-full transition-all duration-300 bg-[#D73D32]"
                                        style={{
                                            width: `${(countEnabled(activeRole.name) / allPermIds.length) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Roles Modal */}
                {showUserRolesModal && selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-xl">
                            <div className="border-b p-4 flex items-center justify-between bg-gray-50">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                                </div>
                                <button
                                    onClick={() => setShowUserRolesModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-4 overflow-y-auto">
                                {selectedUser.roles && selectedUser.roles.length > 0 ? (
                                    <div className="space-y-3">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Role Name</th>
                                                    <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Description</th>
                                                    <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Assigned By</th>
                                                    <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Assigned At</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedUser.roles.map((role, idx) => (
                                                    <tr key={idx} className="border-b border-gray-100">
                                                        <td className="px-3 py-2 text-sm font-medium text-[#D73D32]">{formatRoleLabel(role.name)}</td>
                                                        <td className="px-3 py-2 text-sm text-gray-600">{role.description || '-'}</td>
                                                        <td className="px-3 py-2 text-sm text-gray-600">{role.assigned_by || '-'}</td>
                                                        <td className="px-3 py-2 text-sm text-gray-600">
                                                            {role.assigned_at ? new Date(role.assigned_at).toLocaleDateString() : '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-8">No roles assigned to this user</p>
                                )}
                            </div>
                            <div className="border-t p-4 bg-gray-50">
                                <button
                                    onClick={() => setShowUserRolesModal(false)}
                                    className="w-full px-4 py-2 bg-[#D73D32] text-white rounded-lg hover:bg-[#C2352A] transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Save Button */}
                <div className="mt-5 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full sm:w-auto px-6 py-3 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed bg-[#D73D32] hover:bg-[#C2352A] text-white shadow-sm"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving…
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Save Role Permissions
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Popup notification */}
            {popup.open && (
                <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
                    <div className={`px-4 py-3 rounded-lg shadow-lg ${
                        popup.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                        <p className="text-sm">{popup.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserRole;