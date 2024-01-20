export const DEFAULT_LIMIT = 10;

export const cal = (limit, page) => {
	const _limit = Number.parseInt(limit) || DEFAULT_LIMIT;
	const _page = Number.parseInt(page) || 1;

	return {
		_limit,
		_offset: (_page - 1) * _limit,
	};
};

export const info = (count, limit, page) => {
	const _count = Number.parseInt(count);
	const _limit = Number.parseInt(limit) || DEFAULT_LIMIT;
	const _page = Number.parseInt(page) || 1;

	return {
		_total: _count,
		_total_page: Math.ceil(_count / _limit),
		_page,
		_limit,
	};
};
