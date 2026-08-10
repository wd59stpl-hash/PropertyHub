const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');
const complaintController = require('../controllers/complaintController');

router.use(protect, authorize('admin'));

/**
 * @openapi
 * tags:
 *   name: Admin
 *   description: Platform management and Analytics
 */

/**
 * @openapi
 * /api/admin/stats:
 *   get:
 *     summary: Get dashboard overview statistics
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/stats', adminController.getAdminStats);

/**
 * @openapi
 * /api/admin/pending-properties:
 *   get:
 *     summary: List properties awaiting approval
 *     tags: [Admin]
 */
router.get('/pending-properties', adminController.getPendingProperties);

/**
 * @openapi
 * /api/admin/approve/{id}:
 *   patch:
 *     summary: Approve or Reject a property
 *     tags: [Admin]
 */
router.patch('/approve/:id', adminController.approveProperty);

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     summary: Get list of all registered users
 *     tags: [Admin]
 */
router.get('/users', adminController.getAllUsers);

/**
 * @openapi
 * /api/admin/users/suspend/{id}:
 *   patch:
 *     summary: Suspend or Unsuspended a user account
 *     tags: [Admin]
 */
router.patch('/users/suspend/:id', adminController.suspendUser);

/**
 * @openapi
 * /api/admin/categories:
 *   post:
 *     summary: Add a new property category
 *     tags: [Admin]
 *   get:
 *     summary: Fetch all categories
 *     tags: [Admin]
 */
router.post('/categories', adminController.addCategory);
router.get('/categories', adminController.getCategories);

/**
 * @openapi
 * /api/admin/reports/revenue:
 *   get:
 *     summary: View revenue and sales report
 *     tags: [Admin]
 */
router.get('/reports/revenue', adminController.getRevenueReport);

/**
 * @openapi
 * /api/admin/complaints:
 *   get:
 *     summary: View all user complaints (From Complaint Controller)
 *     tags: [Admin]
 */
router.get('/complaints', complaintController.getAdminComplaints);

/**
 * @openapi
 * /api/admin/complaints/{id}:
 *   patch:
 *     summary: Update complaint resolution status
 *     tags: [Admin]
 */
router.patch('/complaints/:id', complaintController.updateComplaintStatus);

/**
 * @openapi
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user permanently
 *     tags: [Admin]
 */
router.delete('/users/:id', adminController.deleteUser);

/**
 * @openapi
 * /api/admin/reports/analytics:
 *   get:
 *     summary: Get deep analytics and inventory report
 *     tags: [Admin]
 */
router.get('/reports/analytics', adminController.getAnalyticsReport);

module.exports = router;