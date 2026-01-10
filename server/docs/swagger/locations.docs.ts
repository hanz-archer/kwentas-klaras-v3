/**
 * @swagger
 * /api/locations:
 *   get:
 *     summary: Get all locations
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: List of locations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 locations:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 */
