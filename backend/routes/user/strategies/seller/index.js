const express = require('express');
const router = express.Router();
const {Strategy} = require('@backend/db');
const {isOwnerOfStrategy} = require('@backend/middlewares');

router.get('/', async (req, res) => {
  try {
    const {filters, sorter, page, per_page} = req.query;
    let parsed_filters = {};
    try {
      parsed_filters = JSON.parse(filters);
    } catch (error) {
      console.log('Failed to parse filters');
    }

    const seller_id = req.user.user._id;
    const {total, strategies} = await Strategy.findForSeller(
      seller_id,
      parsed_filters,
      sorter,
      page,
      per_page
    );
    if (total != undefined) {
      res.send({
        success: true,
        data: {
          total,
          strategies,
        },
      });
    } else {
      res.send({success: false, message: 'Failed to fetch strategies'});
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

router.get('/:id', isOwnerOfStrategy, async (req, res) => {
  try {
    const strategy_id = req.params.id;
    const projection = req.query.projection;
    let parsed_projection = {};
    try {
      parsed_projection = JSON.parse(projection);
    } catch (error) {
      console.log('Failed to parse projects');
    }

    const strategy = await Strategy.findByIdWithProjection(
      strategy_id,
      parsed_projection
    );
    if (strategy) {
      res.send({
        success: true,
        data: {
          strategy,
        },
      });
    } else {
      res.send({success: false, message: 'Failed to fetch strategies'});
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

router.post('/', async (req, res) => {
  try {
    const user_id = req.user.user._id;
    const strategy = await Strategy.sellStrategy(user_id, req.body);
    if (strategy) res.send({success: true, strategy});
    else res.send({success: false, message: 'Failed to sell'});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

router.put('/:id', isOwnerOfStrategy, async (req, res) => {
  try {
    const strategy_id = req.params.id;
    const strategy_data = req.body;

    const strategy = await Strategy.updateForSale(strategy_id, strategy_data);
    if (strategy) {
      res.send({
        success: true,
        data: {
          strategy,
        },
      });
    } else {
      res.send({success: false, message: 'Failed to update strategy'});
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

router.patch('/:id/toggleStatus', isOwnerOfStrategy, async (req, res) => {
  try {
    const strategy = await Strategy.toggleStatus(
      req.params.id,
      req.user.user._id
    );
    if (strategy) {
      res.send({
        success: true,
        data: {
          strategy,
        },
      });
    } else {
      res.send({success: false, message: 'Failed to toggle status'});
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

router.delete('/:id', isOwnerOfStrategy, async (req, res) => {
  try {
    const strategy_id = req.params.id;

    const success = await Strategy.removeFromForSale(strategy_id);
    res.send({
      success: success,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

module.exports = router;
