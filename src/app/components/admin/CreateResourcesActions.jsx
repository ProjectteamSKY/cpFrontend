// src/components/ResourcesActions/AddResourceActions.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    createResource,
    createPermission,
    fetchResources,
    fetchPermissions,
    deleteResource,
    deletePermission
} from '../../service/UserRolePermissionService';
import FormError from '../../validation/FormError';

const AddResourceActions = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('resource');

    const [resourceForm, setResourceForm] = useState({ name: '', description: '' });
    const [permissionForm, setPermissionForm] = useState({ resource_id: '', action: '', description: '' });

    const [resources, setResources] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingResources, setLoadingResources] = useState(false);
    const [loadingPermissions, setLoadingPermissions] = useState(false);
    const [errors, setErrors] = useState({});
    const [popup, setPopup] = useState({ open: false, message: '', type: 'success' });
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: null, id: null, name: '' });

    // Modal states
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

    // Search and pagination states
    const [resourceSearch, setResourceSearch] = useState('');
    const [permissionSearch, setPermissionSearch] = useState('');
    const [resourcePage, setResourcePage] = useState(1);
    const [permissionPage, setPermissionPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        loadResources();
        loadPermissions();
    }, []);

    const loadResources = async () => {
        setLoadingResources(true);
        try {
            const data = await fetchResources();
            setResources(data);
        } catch {
            setPopup({ open: true, message: 'Failed to load resources', type: 'error' });
        } finally {
            setLoadingResources(false);
        }
    };

    const loadPermissions = async () => {
        setLoadingPermissions(true);
        try {
            const data = await fetchPermissions();
            setPermissions(data);
        } catch {
            setPopup({ open: true, message: 'Failed to load permissions', type: 'error' });
        } finally {
            setLoadingPermissions(false);
        }
    };

    const handleResourceChange = (e) => {
        const { name, value } = e.target;
        setResourceForm(prev => ({ ...prev, [name]: value }));
        if (errors[`resource_${name}`]) setErrors(prev => ({ ...prev, [`resource_${name}`]: '' }));
    };

    const handlePermissionChange = (e) => {
        const { name, value } = e.target;
        setPermissionForm(prev => ({ ...prev, [name]: value }));
        if (errors[`permission_${name}`]) setErrors(prev => ({ ...prev, [`permission_${name}`]: '' }));
    };

    const validateResourceForm = () => {
        const newErrors = {};
        if (!resourceForm.name.trim()) newErrors.resource_name = 'Resource name is required';
        else if (resourceForm.name.length < 3) newErrors.resource_name = 'Resource name must be at least 3 characters';
        else if (resourceForm.name.length > 50) newErrors.resource_name = 'Resource name must be less than 50 characters';
        if (resourceForm.description && resourceForm.description.length > 200)
            newErrors.resource_description = 'Description must be less than 200 characters';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePermissionForm = () => {
        const newErrors = {};
        if (!permissionForm.resource_id) newErrors.permission_resource_id = 'Please select a resource';
        if (!permissionForm.action.trim()) newErrors.permission_action = 'Action is required';
        else if (permissionForm.action.length < 3) newErrors.permission_action = 'Action must be at least 3 characters';
        if (permissionForm.description && permissionForm.description.length > 200)
            newErrors.permission_description = 'Description must be less than 200 characters';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleResourceSubmit = async (e) => {
        e.preventDefault();
        if (!validateResourceForm()) return;
        setLoading(true);
        try {
            await createResource(resourceForm);
            setPopup({ open: true, message: 'Resource created successfully!', type: 'success' });
            setResourceForm({ name: '', description: '' });
            loadResources();
            setResourcePage(1);
            setIsResourceModalOpen(false);
        } catch (error) {
            setPopup({ open: true, message: error.message || 'Failed to create resource', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handlePermissionSubmit = async (e) => {
        e.preventDefault();
        if (!validatePermissionForm()) return;
        setLoading(true);
        try {
            await createPermission(permissionForm);
            setPopup({ open: true, message: 'Permission created successfully!', type: 'success' });
            setPermissionForm({ resource_id: '', action: '', description: '' });
            loadPermissions();
            setPermissionPage(1);
            setIsPermissionModalOpen(false);
        } catch (error) {
            setPopup({ open: true, message: error.message || 'Failed to create permission', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (type, id, name) => setDeleteConfirm({ open: true, type, id, name });

    const handleConfirmDelete = async () => {
        const { type, id, name } = deleteConfirm;
        try {
            if (type === 'resource') {
                await deleteResource(id);
                setPopup({ open: true, message: `Resource "${name}" deleted successfully!`, type: 'success' });
                loadResources();
            } else {
                await deletePermission(id);
                setPopup({ open: true, message: `Permission "${name}" deleted successfully!`, type: 'success' });
                loadPermissions();
            }
        } finally {
            setDeleteConfirm({ open: false, type: null, id: null, name: '' });
        }
    };

    const handleCancelDelete = () => setDeleteConfirm({ open: false, type: null, id: null, name: '' });

    // Reset form when modal opens
    const openResourceModal = () => {
        setResourceForm({ name: '', description: '' });
        setErrors({});
        setIsResourceModalOpen(true);
    };

    const openPermissionModal = () => {
        setPermissionForm({ resource_id: '', action: '', description: '' });
        setErrors({});
        setIsPermissionModalOpen(true);
    };

    // Filter and pagination logic for resources
    const filteredResources = resources.filter(resource =>
        resource.name.toLowerCase().includes(resourceSearch.toLowerCase()) ||
        (resource.description && resource.description.toLowerCase().includes(resourceSearch.toLowerCase()))
    );

    const totalResourcePages = Math.ceil(filteredResources.length / itemsPerPage);
    const paginatedResources = filteredResources.slice(
        (resourcePage - 1) * itemsPerPage,
        resourcePage * itemsPerPage
    );

    // Filter and pagination logic for permissions
    const filteredPermissions = permissions.filter(permission =>
        permission.action.toLowerCase().includes(permissionSearch.toLowerCase()) ||
        (permission.description && permission.description.toLowerCase().includes(permissionSearch.toLowerCase())) ||
        (resources.find(r => r.id === permission.resource_id)?.name || '').toLowerCase().includes(permissionSearch.toLowerCase())
    );

    const totalPermissionPages = Math.ceil(filteredPermissions.length / itemsPerPage);
    const paginatedPermissions = filteredPermissions.slice(
        (permissionPage - 1) * itemsPerPage,
        permissionPage * itemsPerPage
    );

    // Icons
    const PlusIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
    );

    const TrashIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );

    const SearchIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );

    const ChevronLeftIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
    );

    const ChevronRightIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
    );

    const CloseIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );

    return (
        <div className="bg-white">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/admin/Role')}
                        className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#D73D32] transition-all duration-200 mb-4"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back to User Roles</span>
                    </button>

                    <div className="border-l-4 border-[#D73D32] pl-4">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            Resources & Permissions
                        </h1>
                        <p className="text-gray-500 text-base">
                            Manage API resources and their associated permissions
                        </p>
                    </div>
                </div>

                {/* Tabs with Add Buttons */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setActiveTab('resource');
                                        setResourcePage(1);
                                        setResourceSearch('');
                                    }}
                                    className={`px-6 py-3 font-medium text-sm transition-all duration-200 border-b-2 ${activeTab === 'resource'
                                            ? 'text-[#D73D32] border-[#D73D32]'
                                            : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                        </svg>
                                        <span>Resources</span>
                                        <span className="ml-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                            {resources.length}
                                        </span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab('permission');
                                        setPermissionPage(1);
                                        setPermissionSearch('');
                                    }}
                                    className={`px-6 py-3 font-medium text-sm transition-all duration-200 border-b-2 ${activeTab === 'permission'
                                            ? 'text-[#D73D32] border-[#D73D32]'
                                            : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        <span>Permissions</span>
                                        <span className="ml-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                            {permissions.length}
                                        </span>
                                    </div>
                                </button>
                            </div>

                            {/* Add Buttons */}
                            {/* <div className="flex gap-3 pb-2 sm:pb-0">
                                {activeTab === 'resource' ? (
                                    <button
                                        onClick={openResourceModal}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#D73D32] hover:bg-[#c0342a] text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                        <PlusIcon />
                                        <span>Add Resource</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={openPermissionModal}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#D73D32] hover:bg-[#c0342a] text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                        <PlusIcon />
                                        <span>Add Permission</span>
                                    </button>
                                )}
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* Full Width Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Table Header with Search */}
                    <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {activeTab === 'resource' ? 'Resources List' : 'Permissions List'}
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">
                                    {activeTab === 'resource'
                                        ? 'Manage your existing API resources'
                                        : 'Manage your existing permissions'}
                                </p>
                            </div>

                            {/* Search Input */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon />
                                </div>
                                <input
                                    type="text"
                                    placeholder={`Search ${activeTab === 'resource' ? 'resources' : 'permissions'}...`}
                                    value={activeTab === 'resource' ? resourceSearch : permissionSearch}
                                    onChange={(e) => {
                                        if (activeTab === 'resource') {
                                            setResourceSearch(e.target.value);
                                            setResourcePage(1);
                                        } else {
                                            setPermissionSearch(e.target.value);
                                            setPermissionPage(1);
                                        }
                                    }}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D73D32]/20 focus:border-[#D73D32] w-full sm:w-80"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Resources Table */}
                    {activeTab === 'resource' && (
                        <>
                            {loadingResources ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <div className="w-10 h-10 border-3 border-[#D73D32]/20 border-t-[#D73D32] rounded-full animate-spin mb-3" />
                                    <p className="text-gray-500 text-sm">Loading resources...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            ID
                          </th> */}
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Resource Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Description
                                                    </th>
                                                    {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Created At
                          </th> */}
                                                    {/* <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Actions
                                                    </th> */}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {paginatedResources.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="5" className="px-6 py-12 text-center">
                                                            <div className="flex flex-col items-center">
                                                                <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                                </svg>
                                                                <p className="text-gray-500 font-medium">No resources found</p>
                                                                <p className="text-gray-400 text-sm mt-1">
                                                                    {resourceSearch ? 'Try a different search term' : 'Click "Add Resource" to create your first resource'}
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    paginatedResources.map((resource) => (
                                                        <tr key={resource.id} className="hover:bg-gray-50 transition-colors duration-200">
                                                            {/* <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  #{resource.id}
                                </span>
                              </td> */}
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-[#D73D32]"></div>
                                                                    <span className="font-medium text-gray-900">{resource.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="text-gray-500 text-sm">
                                                                    {resource.description || '—'}
                                                                </span>
                                                            </td>
                                                            {/* <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-gray-500 text-sm">
                                  {resource.created_at ? new Date(resource.created_at).toLocaleDateString() : '—'}
                                </span>
                              </td> */}
                                                            {/* <td className="px-6 py-4 whitespace-nowrap text-right">
                                                                <button
                                                                    onClick={() => handleDeleteClick('resource', resource.id, resource.name)}
                                                                    className="p-2 text-gray-400 hover:text-[#D73D32] transition-all duration-200 rounded-lg hover:bg-red-50"
                                                                >
                                                                    <TrashIcon />
                                                                </button>
                                                            </td> */}
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {filteredResources.length > 0 && (
                                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between flex-wrap gap-4">
                                            <div className="text-sm text-gray-600">
                                                Showing {((resourcePage - 1) * itemsPerPage) + 1} to{' '}
                                                {Math.min(resourcePage * itemsPerPage, filteredResources.length)} of{' '}
                                                {filteredResources.length} entries
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setResourcePage(p => Math.max(1, p - 1))}
                                                    disabled={resourcePage === 1}
                                                    className="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                >
                                                    <ChevronLeftIcon />
                                                </button>
                                                <div className="flex gap-1">
                                                    {Array.from({ length: Math.min(5, totalResourcePages) }, (_, i) => {
                                                        let pageNum;
                                                        if (totalResourcePages <= 5) {
                                                            pageNum = i + 1;
                                                        } else if (resourcePage <= 3) {
                                                            pageNum = i + 1;
                                                        } else if (resourcePage >= totalResourcePages - 2) {
                                                            pageNum = totalResourcePages - 4 + i;
                                                        } else {
                                                            pageNum = resourcePage - 2 + i;
                                                        }
                                                        return (
                                                            <button
                                                                key={pageNum}
                                                                onClick={() => setResourcePage(pageNum)}
                                                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${resourcePage === pageNum
                                                                        ? 'bg-[#D73D32] text-white'
                                                                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                                                                    }`}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                <button
                                                    onClick={() => setResourcePage(p => Math.min(totalResourcePages, p + 1))}
                                                    disabled={resourcePage === totalResourcePages}
                                                    className="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                >
                                                    <ChevronRightIcon />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {/* Permissions Table */}
                    {activeTab === 'permission' && (
                        <>
                            {loadingPermissions ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <div className="w-10 h-10 border-3 border-[#D73D32]/20 border-t-[#D73D32] rounded-full animate-spin mb-3" />
                                    <p className="text-gray-500 text-sm">Loading permissions...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            ID
                          </th> */}
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Action
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Resource
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Description
                                                    </th>
                                                    {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Created At
                          </th> */}
                                                    {/* <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Actions
                                                    </th> */}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {paginatedPermissions.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="6" className="px-6 py-12 text-center">
                                                            <div className="flex flex-col items-center">
                                                                <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                </svg>
                                                                <p className="text-gray-500 font-medium">No permissions found</p>
                                                                <p className="text-gray-400 text-sm mt-1">
                                                                    {permissionSearch ? 'Try a different search term' : 'Click "Add Permission" to create your first permission'}
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    paginatedPermissions.map((permission) => (
                                                        <tr key={permission.id} className="hover:bg-gray-50 transition-colors duration-200">
                                                            {/* <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  #{permission.id}
                                </span>
                              </td> */}
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="px-2 py-1 bg-[#D73D32]/10 text-[#D73D32] rounded-md text-xs font-semibold">
                                                                    {permission.action}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="text-gray-700 text-sm font-medium">
                                                                    {resources.find(r => r.id === permission.resource_id)?.name ||
                                                                        permission.resource_name ||
                                                                        permission.resource_id}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="text-gray-500 text-sm">
                                                                    {permission.description || '—'}
                                                                </span>
                                                            </td>
                                                            {/* <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-gray-500 text-sm">
                                  {permission.created_at ? new Date(permission.created_at).toLocaleDateString() : '—'}
                                </span>
                              </td> */}
                                                            {/* <td className="px-6 py-4 whitespace-nowrap text-right">
                                                                <button
                                                                    onClick={() => handleDeleteClick('permission', permission.id, permission.action)}
                                                                    className="p-2 text-gray-400 hover:text-[#D73D32] transition-all duration-200 rounded-lg hover:bg-red-50"
                                                                >
                                                                    <TrashIcon />
                                                                </button>
                                                            </td> */}
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {filteredPermissions.length > 0 && (
                                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between flex-wrap gap-4">
                                            <div className="text-sm text-gray-600">
                                                Showing {((permissionPage - 1) * itemsPerPage) + 1} to{' '}
                                                {Math.min(permissionPage * itemsPerPage, filteredPermissions.length)} of{' '}
                                                {filteredPermissions.length} entries
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setPermissionPage(p => Math.max(1, p - 1))}
                                                    disabled={permissionPage === 1}
                                                    className="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                >
                                                    <ChevronLeftIcon />
                                                </button>
                                                <div className="flex gap-1">
                                                    {Array.from({ length: Math.min(5, totalPermissionPages) }, (_, i) => {
                                                        let pageNum;
                                                        if (totalPermissionPages <= 5) {
                                                            pageNum = i + 1;
                                                        } else if (permissionPage <= 3) {
                                                            pageNum = i + 1;
                                                        } else if (permissionPage >= totalPermissionPages - 2) {
                                                            pageNum = totalPermissionPages - 4 + i;
                                                        } else {
                                                            pageNum = permissionPage - 2 + i;
                                                        }
                                                        return (
                                                            <button
                                                                key={pageNum}
                                                                onClick={() => setPermissionPage(pageNum)}
                                                                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${permissionPage === pageNum
                                                                        ? 'bg-[#D73D32] text-white'
                                                                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                                                                    }`}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                <button
                                                    onClick={() => setPermissionPage(p => Math.min(totalPermissionPages, p + 1))}
                                                    disabled={permissionPage === totalPermissionPages}
                                                    className="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                >
                                                    <ChevronRightIcon />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Add Resource Modal */}
            {isResourceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsResourceModalOpen(false)} />
                    <div
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D73D32] to-[#e86860]"></div>

                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900">Create New Resource</h2>
                                    <button
                                        onClick={() => setIsResourceModalOpen(false)}
                                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>

                                <form onSubmit={handleResourceSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Resource Name <span className="text-[#D73D32]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={resourceForm.name}
                                            onChange={handleResourceChange}
                                            placeholder="e.g., clubs, events, users"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D73D32]/20 focus:border-[#D73D32] transition-all duration-200"
                                            autoFocus
                                        />
                                        <FormError message={errors.resource_name} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={resourceForm.description}
                                            onChange={handleResourceChange}
                                            placeholder="Describe what this resource represents"
                                            rows="4"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D73D32]/20 focus:border-[#D73D32] transition-all duration-200 resize-none"
                                        />
                                        <FormError message={errors.resource_description} />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsResourceModalOpen(false)}
                                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 px-4 py-2.5 bg-[#D73D32] hover:bg-[#c0342a] text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                'Create Resource'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Permission Modal */}
            {isPermissionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsPermissionModalOpen(false)} />
                    <div
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D73D32] to-[#e86860]"></div>

                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900">Create New Permission</h2>
                                    <button
                                        onClick={() => setIsPermissionModalOpen(false)}
                                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>

                                <form onSubmit={handlePermissionSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Select Resource <span className="text-[#D73D32]">*</span>
                                        </label>
                                        <select
                                            name="resource_id"
                                            value={permissionForm.resource_id}
                                            onChange={handlePermissionChange}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D73D32]/20 focus:border-[#D73D32] transition-all duration-200"
                                        >
                                            <option value="">Choose a resource...</option>
                                            {resources.map(resource => (
                                                <option key={resource.id} value={resource.id}>
                                                    {resource.name}
                                                </option>
                                            ))}
                                        </select>
                                        <FormError message={errors.permission_resource_id} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Action Name <span className="text-[#D73D32]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="action"
                                            value={permissionForm.action}
                                            onChange={handlePermissionChange}
                                            placeholder="e.g., create, view, edit, delete"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D73D32]/20 focus:border-[#D73D32] transition-all duration-200"
                                        />
                                        <FormError message={errors.permission_action} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={permissionForm.description}
                                            onChange={handlePermissionChange}
                                            placeholder="Describe what this permission allows"
                                            rows="4"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D73D32]/20 focus:border-[#D73D32] transition-all duration-200 resize-none"
                                        />
                                        <FormError message={errors.permission_description} />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsPermissionModalOpen(false)}
                                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 px-4 py-2.5 bg-[#D73D32] hover:bg-[#c0342a] text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                'Create Permission'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCancelDelete} />
                    <div
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D73D32] to-[#e86860]"></div>

                            <div className="p-6">
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleCancelDelete}
                                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>

                                <div className="text-center">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                                        <svg className="w-10 h-10 text-[#D73D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Confirmation</h3>
                                    <p className="text-gray-500 mb-6">
                                        Are you sure you want to delete <span className="font-semibold text-gray-900">"{deleteConfirm.name}"</span>?
                                        <br />
                                        <span className="text-sm">This action cannot be undone.</span>
                                    </p>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleCancelDelete}
                                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleConfirmDelete}
                                            className="flex-1 px-4 py-2.5 bg-[#D73D32] hover:bg-[#c0342a] text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                        >
                                            Delete Forever
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Popup Component Placeholder */}
            {/* <SuccessPopup
        isOpen={popup.open}
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup({ open: false, message: '' })}
      /> */}
        </div>
    );
};

export default AddResourceActions;