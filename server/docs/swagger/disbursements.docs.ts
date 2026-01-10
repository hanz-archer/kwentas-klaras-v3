/**
 * @swagger
 * /api/disbursements:
 *   get:
 *     summary: Get all disbursements
 *     tags: [Disbursements]
 *     responses:
 *       200:
 *         description: List of disbursements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 disbursements:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/disbursements/{id}:
 *   get:
 *     summary: Get disbursement by ID
 *     tags: [Disbursements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Disbursement ID
 *     responses:
 *       200:
 *         description: Disbursement found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 disbursement:
 *                   type: object
 *       400:
 *         description: Bad request - ID is required
 *       404:
 *         description: Disbursement not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update disbursement
 *     tags: [Disbursements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Disbursement ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               reason:
 *                 type: string
 *               payee:
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
 *       200:
 *         description: Disbursement updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 disbursement:
 *                   type: object
 *       400:
 *         description: Bad request
 *       404:
 *         description: Disbursement not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/disbursements/create:
 *   post:
 *     summary: Create a new disbursement
 *     tags: [Disbursements]
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
 *               - payee
 *             properties:
 *               projectId:
 *                 type: string
 *               amount:
 *                 type: number
 *               reason:
 *                 type: string
 *               payee:
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
 *         description: Disbursement created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 disbursement:
 *                   type: object
 *       400:
 *         description: Bad request - missing required fields
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/disbursements/project/{projectId}:
 *   get:
 *     summary: Get disbursements by project ID
 *     tags: [Disbursements]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Disbursements for project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 disbursements:
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
