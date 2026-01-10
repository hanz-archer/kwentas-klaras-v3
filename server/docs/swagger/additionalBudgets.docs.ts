/**
 * @swagger
 * /api/additional-budgets:
 *   get:
 *     summary: Get all additional budgets
 *     tags: [Additional Budgets]
 *     responses:
 *       200:
 *         description: List of additional budgets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 budgets:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/additional-budgets/{id}:
 *   get:
 *     summary: Get additional budget by ID
 *     tags: [Additional Budgets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Additional budget ID
 *     responses:
 *       200:
 *         description: Additional budget found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 budget:
 *                   type: object
 *       400:
 *         description: Bad request - ID is required
 *       404:
 *         description: Additional budget not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/additional-budgets/create:
 *   post:
 *     summary: Create a new additional budget
 *     tags: [Additional Budgets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - amount
 *               - reason
 *             properties:
 *               projectId:
 *                 type: string
 *               amount:
 *                 type: number
 *                 minimum: 0
 *               reason:
 *                 type: string
 *               approvedBy:
 *                 type: string
 *               approvedDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       201:
 *         description: Additional budget created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 budget:
 *                   type: object
 *       400:
 *         description: Bad request - missing required fields or invalid amount
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/additional-budgets/project/{projectId}:
 *   get:
 *     summary: Get additional budgets by project ID
 *     tags: [Additional Budgets]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Additional budgets for project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 budgets:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Bad request - project ID is required
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
