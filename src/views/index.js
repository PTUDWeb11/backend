class Response {
	constructor(res) {
		this.res = res;
		this.statusCode = 200;
		this.body = {};
	}

	status(statusCode) {
		this.statusCode = statusCode;
		return this;
	}

	meta(meta) {
		this.body.meta = meta;
		return this;
	}

	message(message) {
		this.body.message = message;
		return this;
	}

	json(data) {
		this.body.data = data;
		return this.res.status(this.statusCode).json(this.body);
	}

	success() {
		return this.res.status(200).json({ success: true });
	}
}

export default Response;
