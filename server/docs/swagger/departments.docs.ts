/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: List of departments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 departments:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 */
