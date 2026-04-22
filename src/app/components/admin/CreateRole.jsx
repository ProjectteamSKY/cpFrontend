// src/components/UserRolePermission/AddRole.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRole, fetchRoles, deleteRole, assignRoleToUser, fetchUsers } from '../../service/UserRolePermissionService';
import FormError from '../../validation/FormError';
import { getUserId } from '../../utils/authStorage';

const AddRole = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', description: '' });
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState({ open: false, message: '', type: 'success' });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, roleId: null, roleName: '' });

  // Modal states
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Assign form state
  const [assignFormData, setAssignFormData] = useState({
    user_id: '',
    role_id: '',
    assigned_by: ''
  });
  const [assignErrors, setAssignErrors] = useState({});
  const [assignLoading, setAssignLoading] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Search and pagination states for roles
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Refs for dropdown
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Get current user ID from localStorage or context (adjust based on your auth system)
  const getCurrentUserId = () => {
    return getUserId() || null;
  };

  useEffect(() => {
    loadRoles();
    loadUsers();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadRoles = async () => {
    setLoadingRoles(true);
    try {
      const data = await fetchRoles();
      setRoles(data);
    } catch (error) {
      setPopup({ open: true, message: error.message || 'Failed to load roles', type: 'error' });
    } finally {
      setLoadingRoles(false);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      setPopup({ open: true, message: error.message || 'Failed to load users', type: 'error' });
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAssignChange = (e) => {
    const { name, value } = e.target;
    setAssignFormData(prev => ({ ...prev, [name]: value }));
    if (assignErrors[name]) setAssignErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Role name must be at least 3 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Role name must be less than 50 characters';
    }
    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAssignForm = () => {
    const newErrors = {};
    if (!assignFormData.user_id) {
      newErrors.user_id = 'Please select a user';
    }
    if (!assignFormData.role_id) {
      newErrors.role_id = 'Please select a role';
    }
    setAssignErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await createRole(formData);
      setPopup({ open: true, message: 'Role created successfully!', type: 'success' });
      setFormData({ name: '', description: '' });
      loadRoles();
      setCurrentPage(1);
      setIsRoleModalOpen(false);
      setTimeout(() => {
        setPopup({ open: false, message: '' });
      }, 1500);
    } catch (error) {
      setPopup({ open: true, message: error.message || 'Failed to create role', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!validateAssignForm()) return;

    setAssignLoading(true);
    try {
      const assignData = {
        ...assignFormData,
        assigned_by: getCurrentUserId()
      };
      await assignRoleToUser(assignData);
      setPopup({ open: true, message: 'Role assigned to user successfully!', type: 'success' });

      // Reset assign form
      setAssignFormData({
        user_id: '',
        role_id: '',
        assigned_by: ''
      });
      setUserSearchTerm('');
      setIsAssignModalOpen(false);

      setTimeout(() => {
        setPopup({ open: false, message: '' });
      }, 1500);
    } catch (error) {
      setPopup({ open: true, message: error.message || 'Failed to assign role', type: 'error' });
    } finally {
      setAssignLoading(false);
    }
  };

  const handleDeleteClick = (roleId, roleName) => {
    setDeleteConfirm({ open: true, roleId, roleName });
  };

  const handleConfirmDelete = async () => {
    const { roleId, roleName } = deleteConfirm;
    try {
      await deleteRole(roleId);
      setPopup({ open: true, message: `Role "${roleName}" deleted successfully!`, type: 'success' });
      loadRoles();
      setTimeout(() => {
        setPopup({ open: false, message: '' });
      }, 1500);
    } catch (error) {
      setPopup({ open: true, message: error.message || 'Failed to delete role', type: 'error' });
    } finally {
      setDeleteConfirm({ open: false, roleId: null, roleName: '' });
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm({ open: false, roleId: null, roleName: '' });
  };

  const openRoleModal = () => {
    setFormData({ name: '', description: '' });
    setErrors({});
    setIsRoleModalOpen(true);
  };

  const openAssignModal = () => {
    setAssignFormData({
      user_id: '',
      role_id: '',
      assigned_by: ''
    });
    setUserSearchTerm('');
    setAssignErrors({});
    setIsAssignModalOpen(true);
    // Focus on search input when modal opens
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  // Filter users for dropdown - Prioritize name search over email
  const getSearchScore = (user, searchTerm) => {
    const name = (user.full_name || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    const search = searchTerm.toLowerCase();

    // Exact name match gets highest priority
    if (name === search) return 4;
    // Name starts with search term
    if (name.startsWith(search)) return 3;
    // Name includes search term
    if (name.includes(search)) return 2;
    // Email includes search term (lowest priority)
    if (email.includes(search)) return 1;
    return 0;
  };

  const filteredUsers = users
    .filter(user => {
      const search = userSearchTerm.toLowerCase();
      const name = (user.full_name || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      return name.includes(search) || email.includes(search);
    })
    .sort((a, b) => {
      // Sort by search score (higher score first)
      const scoreA = getSearchScore(a, userSearchTerm);
      const scoreB = getSearchScore(b, userSearchTerm);
      if (scoreA !== scoreB) return scoreB - scoreA;
      // If scores are equal, sort alphabetically by name
      return (a.full_name || '').localeCompare(b.full_name || '');
    });

  const handleSelectUser = (user) => {
    setAssignFormData(prev => ({ ...prev, user_id: user.id }));
    setUserSearchTerm(user.full_name); // Show name instead of email
    setShowUserDropdown(false);
    if (assignErrors.user_id) {
      setAssignErrors(prev => ({ ...prev, user_id: '' }));
    }
  };

  // Filter and pagination logic for roles
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Icons
  const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
    </svg>
  );

  const UserPlusIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
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
    <div className="min-h-screen bg-white">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/Role')}
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#D73D32] transition-all duration-200 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
          </button>

          <div className="border-l-4 border-[#D73D32] pl-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Role Management
            </h1>
            <p className="text-gray-500 text-base">
              Create and manage user roles for your application
            </p>
          </div>
        </div>

        {/* Header with Action Buttons */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Roles List</h2>
              <p className="text-gray-500 text-sm mt-1">Manage all user roles in one place</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={openAssignModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#D73D32] hover:bg-[#c0342a] text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <UserPlusIcon />
                <span>Assign Role to User</span>
              </button>

              <button
                onClick={openRoleModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#D73D32] hover:bg-[#c0342a] text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <PlusIcon />
                <span>Add Role</span>
              </button>
            </div>
          </div>
        </div>

        {/* Full Width Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Table Header with Search */}
          <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="text-gray-700 font-medium">Total Roles:</span>
                  <span className="px-2 py-1 bg-[#D73D32]/10 text-[#D73D32] rounded-md text-sm font-semibold">
                    {roles.length}
                  </span>
                </div>
              </div>

              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D73D32]/20 focus:border-[#D73D32] w-full sm:w-80"
                />
              </div>
            </div>
          </div>

          {/* Roles Table */}
          {loadingRoles ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-3 border-[#D73D32]/20 border-t-[#D73D32] rounded-full animate-spin mb-3" />
              <p className="text-gray-500 text-sm">Loading roles...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedRoles.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <p className="text-gray-500 font-medium">No roles found</p>
                            <p className="text-gray-400 text-sm mt-1">
                              {searchTerm ? 'Try a different search term' : 'Click "Add Role" to create your first role'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedRoles.map((role) => (
                        <tr key={role.id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#D73D32]"></div>
                              <span className="font-semibold text-gray-900">{role.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-500 text-sm">
                              {role.description || '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-500 text-sm">
                              {role.created_at ? new Date(role.created_at).toLocaleDateString() : '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => handleDeleteClick(role.id, role.name)}
                              className="p-2 text-gray-400 hover:text-[#D73D32] transition-all duration-200 rounded-lg hover:bg-red-50"
                              title={`Delete ${role.name}`}
                            >
                              <TrashIcon />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredRoles.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between flex-wrap gap-4">
                  <div className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, filteredRoles.length)} of{' '}
                    {filteredRoles.length} entries
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeftIcon />
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${currentPage === pageNum
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
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRightIcon />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Role Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsRoleModalOpen(false)} />
          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D73D32] to-[#e86860]"></div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Create New Role</h2>
                  <button
                    onClick={() => setIsRoleModalOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <CloseIcon />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Role Name <span className="text-[#D73D32]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., admin, clubManager, eventCoordinator"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D73D32]/20 focus:border-[#D73D32] transition-all duration-200"
                      autoFocus
                    />
                    <FormError message={errors.name} />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the role's purpose and responsibilities"
                      rows="4"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D73D32]/20 focus:border-[#D73D32] transition-all duration-200 resize-none"
                    />
                    <FormError message={errors.description} />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsRoleModalOpen(false)}
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
                        'Create Role'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Role to User Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAssignModalOpen(false)} />
          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D73D32] to-[#e86860]"></div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Assign Role to User</h2>
                  <button
                    onClick={() => setIsAssignModalOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <CloseIcon />
                  </button>
                </div>

                <form onSubmit={handleAssignSubmit} className="space-y-5">
                  {/* User Selection with Search - Prioritizing Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select User <span className="text-red-500">*</span>
                    </label>
                    <div className="relative" ref={dropdownRef}>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <SearchIcon />
                        </div>
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={userSearchTerm}
                          onChange={(e) => {
                            setUserSearchTerm(e.target.value);
                            setShowUserDropdown(true);
                            if (assignFormData.user_id) {
                              setAssignFormData(prev => ({ ...prev, user_id: '' }));
                            }
                          }}
                          onFocus={() => setShowUserDropdown(true)}
                          placeholder="Search by user name..."
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                        />
                      </div>

                      {/* Dropdown with scroll and name-first display */}
                      {showUserDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                          {loadingUsers ? (
                            <div className="p-4 text-center text-gray-500">
                              <div className="inline-block w-5 h-5 border-2 border-green-500/20 border-t-green-500 rounded-full animate-spin mr-2"></div>
                              Loading users...
                            </div>
                          ) : filteredUsers.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              {userSearchTerm ? 'No users found matching your search' : 'Start typing to search users by name'}
                            </div>
                          ) : (
                            <div className="max-h-64 overflow-y-auto">
                              {filteredUsers.map((user, index) => (
                                <button
                                  key={user.id}
                                  type="button"
                                  onClick={() => handleSelectUser(user)}
                                  className={`w-full px-4 py-3 text-left hover:bg-green-50 transition-colors ${index !== filteredUsers.length - 1 ? 'border-b border-gray-100' : ''
                                    }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="font-medium text-gray-900">{user.full_name}</div>
                                    {user.is_active === 1 && (
                                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                        Active
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-500 mt-0.5">{user.email}</div>
                                  {user.contact && (
                                    <div className="text-xs text-gray-400 mt-1">{user.contact}</div>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Scroll indicator */}
                          {filteredUsers.length > 5 && (
                            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                          )}
                        </div>
                      )}
                    </div>
                    <FormError message={assignErrors.user_id} />

                    {/* Selected user display - shows name prominently */}
                    {assignFormData.user_id && userSearchTerm && (
                      <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-sm font-medium text-green-800">Selected User:</span>
                          <span className="text-sm text-green-700 font-semibold">{userSearchTerm}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Role <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="role_id"
                        value={assignFormData.role_id}
                        onChange={handleAssignChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 appearance-none bg-white"
                      >
                        <option value="">Select a role</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name} {role.description ? `- ${role.description.substring(0, 50)}${role.description.length > 50 ? '...' : ''}` : ''}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <FormError message={assignErrors.role_id} />
                  </div>

                  {/* Info message about assigned_by */}
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-sm text-blue-700">
                        <p className="font-medium mb-1">About Assignment</p>
                        <p className="text-blue-600">The role will be assigned to the selected user. Your ID will be recorded as the assigner.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAssignModalOpen(false)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={assignLoading}
                      className="flex-1 px-4 py-2.5 bg-[#D73D32] hover:bg-[#c0342a] text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {assignLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Assigning...
                        </>
                      ) : (
                        'Assign Role'
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
                    Are you sure you want to delete <span className="font-semibold text-gray-900">"{deleteConfirm.roleName}"</span>?
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

      {/* Success/Error Popup */}
      {popup.open && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div className={`rounded-lg shadow-lg p-4 ${popup.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
            <div className="flex items-center gap-3">
              {popup.type === 'success' ? (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <p className={`text-sm ${popup.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {popup.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRole;