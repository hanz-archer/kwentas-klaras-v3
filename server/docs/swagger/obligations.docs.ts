/**
 * @swagger
 * /api/obligations:
 *   get:
 *     summary: Get all obligations
 *     tags: [Obligations]
 *     responses:
 *       200:
 *         description: List of obligations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 obligations:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/obligations/{id}:
 *   get:
 *     summary: Get obligation by ID
 *     tags: [Obligations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Obligation ID
 *     responses:
 *       200:
 *         description: Obligation found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 obligation:
 *                   type: object
 *       400:
 *         description: Bad request - ID is required
 *       404:
 *         description: Obligation not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/obligations/create:
 *   post:
 *     summary: Create a new obligation
 *     tags: [Obligations]
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
 *         description: Obligation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 obligation:
 *                   type: object
 *       400:
 *         description: Bad request - missing required fields
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/obligations/project/{projectId}:
 *   get:
 *     summary: Get obligations by project ID
 *     tags: [Obligations]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Obligations for project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 obligations:
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
