/**
 * @swagger
 * /api/remarks:
 *   get:
 *     summary: Get all remarks
 *     tags: [Remarks]
 *     responses:
 *       200:
 *         description: List of remarks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 remarks:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Internal server error
 */
