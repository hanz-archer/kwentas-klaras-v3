/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 projects:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - appropriation
 *               - year
 *               - services
 *               - startDate
 *               - endDate
 *             properties:
 *               name:
 *                 type: string
 *               implementingUnit:
 *                 type: string
 *               location:
 *                 type: string
 *               appropriation:
 *                 type: number
 *               year:
 *                 type: number
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *               remarks:
 *                 type: string
 *               code:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 project:
 *                   type: object
 *       400:
 *         description: Bad request - missing required fields
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 project:
 *                   type: object
 *       400:
 *         description: Bad request - ID is required
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               implementingUnit:
 *                 type: string
 *               location:
 *                 type: string
 *               appropriation:
 *                 type: number
 *               year:
 *                 type: number
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *               remarks:
 *                 type: string
 *               code:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 project:
 *                   type: object
 *       400:
 *         description: Bad request - ID is required
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/projects/{id}/activities:
 *   get:
 *     summary: Get project activities
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project activities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 activities:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Bad request - ID is required
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/projects/{id}/geotag:
 *   patch:
 *     summary: Update project geotag
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - latitude
 *               - longitude
 *             properties:
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Project geotag updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 project:
 *                   type: object
 *       400:
 *         description: Bad request
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
