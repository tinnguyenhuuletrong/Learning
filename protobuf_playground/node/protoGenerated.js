/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.messasing = (function() {

    /**
     * Namespace messasing.
     * @exports messasing
     * @namespace
     */
    var messasing = {};

    messasing.PingBody = (function() {

        /**
         * Properties of a PingBody.
         * @memberof messasing
         * @interface IPingBody
         * @property {number|null} [nounce] PingBody nounce
         */

        /**
         * Constructs a new PingBody.
         * @memberof messasing
         * @classdesc Represents a PingBody.
         * @implements IPingBody
         * @constructor
         * @param {messasing.IPingBody=} [properties] Properties to set
         */
        function PingBody(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PingBody nounce.
         * @member {number} nounce
         * @memberof messasing.PingBody
         * @instance
         */
        PingBody.prototype.nounce = 0;

        /**
         * Creates a new PingBody instance using the specified properties.
         * @function create
         * @memberof messasing.PingBody
         * @static
         * @param {messasing.IPingBody=} [properties] Properties to set
         * @returns {messasing.PingBody} PingBody instance
         */
        PingBody.create = function create(properties) {
            return new PingBody(properties);
        };

        /**
         * Encodes the specified PingBody message. Does not implicitly {@link messasing.PingBody.verify|verify} messages.
         * @function encode
         * @memberof messasing.PingBody
         * @static
         * @param {messasing.IPingBody} message PingBody message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PingBody.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nounce != null && message.hasOwnProperty("nounce"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.nounce);
            return writer;
        };

        /**
         * Encodes the specified PingBody message, length delimited. Does not implicitly {@link messasing.PingBody.verify|verify} messages.
         * @function encodeDelimited
         * @memberof messasing.PingBody
         * @static
         * @param {messasing.IPingBody} message PingBody message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PingBody.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PingBody message from the specified reader or buffer.
         * @function decode
         * @memberof messasing.PingBody
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {messasing.PingBody} PingBody
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PingBody.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.messasing.PingBody();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.nounce = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PingBody message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof messasing.PingBody
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {messasing.PingBody} PingBody
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PingBody.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PingBody message.
         * @function verify
         * @memberof messasing.PingBody
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PingBody.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nounce != null && message.hasOwnProperty("nounce"))
                if (!$util.isInteger(message.nounce))
                    return "nounce: integer expected";
            return null;
        };

        /**
         * Creates a PingBody message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof messasing.PingBody
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {messasing.PingBody} PingBody
         */
        PingBody.fromObject = function fromObject(object) {
            if (object instanceof $root.messasing.PingBody)
                return object;
            var message = new $root.messasing.PingBody();
            if (object.nounce != null)
                message.nounce = object.nounce | 0;
            return message;
        };

        /**
         * Creates a plain object from a PingBody message. Also converts values to other types if specified.
         * @function toObject
         * @memberof messasing.PingBody
         * @static
         * @param {messasing.PingBody} message PingBody
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PingBody.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.nounce = 0;
            if (message.nounce != null && message.hasOwnProperty("nounce"))
                object.nounce = message.nounce;
            return object;
        };

        /**
         * Converts this PingBody to JSON.
         * @function toJSON
         * @memberof messasing.PingBody
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PingBody.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PingBody;
    })();

    messasing.PongBody = (function() {

        /**
         * Properties of a PongBody.
         * @memberof messasing
         * @interface IPongBody
         * @property {number|null} [reply] PongBody reply
         */

        /**
         * Constructs a new PongBody.
         * @memberof messasing
         * @classdesc Represents a PongBody.
         * @implements IPongBody
         * @constructor
         * @param {messasing.IPongBody=} [properties] Properties to set
         */
        function PongBody(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PongBody reply.
         * @member {number} reply
         * @memberof messasing.PongBody
         * @instance
         */
        PongBody.prototype.reply = 0;

        /**
         * Creates a new PongBody instance using the specified properties.
         * @function create
         * @memberof messasing.PongBody
         * @static
         * @param {messasing.IPongBody=} [properties] Properties to set
         * @returns {messasing.PongBody} PongBody instance
         */
        PongBody.create = function create(properties) {
            return new PongBody(properties);
        };

        /**
         * Encodes the specified PongBody message. Does not implicitly {@link messasing.PongBody.verify|verify} messages.
         * @function encode
         * @memberof messasing.PongBody
         * @static
         * @param {messasing.IPongBody} message PongBody message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PongBody.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.reply != null && message.hasOwnProperty("reply"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.reply);
            return writer;
        };

        /**
         * Encodes the specified PongBody message, length delimited. Does not implicitly {@link messasing.PongBody.verify|verify} messages.
         * @function encodeDelimited
         * @memberof messasing.PongBody
         * @static
         * @param {messasing.IPongBody} message PongBody message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PongBody.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PongBody message from the specified reader or buffer.
         * @function decode
         * @memberof messasing.PongBody
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {messasing.PongBody} PongBody
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PongBody.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.messasing.PongBody();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.reply = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PongBody message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof messasing.PongBody
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {messasing.PongBody} PongBody
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PongBody.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PongBody message.
         * @function verify
         * @memberof messasing.PongBody
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PongBody.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.reply != null && message.hasOwnProperty("reply"))
                if (!$util.isInteger(message.reply))
                    return "reply: integer expected";
            return null;
        };

        /**
         * Creates a PongBody message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof messasing.PongBody
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {messasing.PongBody} PongBody
         */
        PongBody.fromObject = function fromObject(object) {
            if (object instanceof $root.messasing.PongBody)
                return object;
            var message = new $root.messasing.PongBody();
            if (object.reply != null)
                message.reply = object.reply | 0;
            return message;
        };

        /**
         * Creates a plain object from a PongBody message. Also converts values to other types if specified.
         * @function toObject
         * @memberof messasing.PongBody
         * @static
         * @param {messasing.PongBody} message PongBody
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PongBody.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.reply = 0;
            if (message.reply != null && message.hasOwnProperty("reply"))
                object.reply = message.reply;
            return object;
        };

        /**
         * Converts this PongBody to JSON.
         * @function toJSON
         * @memberof messasing.PongBody
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PongBody.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PongBody;
    })();

    /**
     * MSG_TYPE enum.
     * @name messasing.MSG_TYPE
     * @enum {string}
     * @property {number} PING=0 PING value
     * @property {number} PONG=1 PONG value
     */
    messasing.MSG_TYPE = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "PING"] = 0;
        values[valuesById[1] = "PONG"] = 1;
        return values;
    })();

    messasing.AwesomeMessage = (function() {

        /**
         * Properties of an AwesomeMessage.
         * @memberof messasing
         * @interface IAwesomeMessage
         * @property {messasing.MSG_TYPE|null} [type] AwesomeMessage type
         * @property {number|Long|null} [id] AwesomeMessage id
         * @property {number|Long|null} [createdAt] AwesomeMessage createdAt
         * @property {Object.<string,google.protobuf.IAny>|null} [extra] AwesomeMessage extra
         * @property {messasing.IPingBody|null} [pingBody] AwesomeMessage pingBody
         * @property {messasing.IPongBody|null} [pongBody] AwesomeMessage pongBody
         */

        /**
         * Constructs a new AwesomeMessage.
         * @memberof messasing
         * @classdesc Represents an AwesomeMessage.
         * @implements IAwesomeMessage
         * @constructor
         * @param {messasing.IAwesomeMessage=} [properties] Properties to set
         */
        function AwesomeMessage(properties) {
            this.extra = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AwesomeMessage type.
         * @member {messasing.MSG_TYPE} type
         * @memberof messasing.AwesomeMessage
         * @instance
         */
        AwesomeMessage.prototype.type = 0;

        /**
         * AwesomeMessage id.
         * @member {number|Long} id
         * @memberof messasing.AwesomeMessage
         * @instance
         */
        AwesomeMessage.prototype.id = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * AwesomeMessage createdAt.
         * @member {number|Long} createdAt
         * @memberof messasing.AwesomeMessage
         * @instance
         */
        AwesomeMessage.prototype.createdAt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * AwesomeMessage extra.
         * @member {Object.<string,google.protobuf.IAny>} extra
         * @memberof messasing.AwesomeMessage
         * @instance
         */
        AwesomeMessage.prototype.extra = $util.emptyObject;

        /**
         * AwesomeMessage pingBody.
         * @member {messasing.IPingBody|null|undefined} pingBody
         * @memberof messasing.AwesomeMessage
         * @instance
         */
        AwesomeMessage.prototype.pingBody = null;

        /**
         * AwesomeMessage pongBody.
         * @member {messasing.IPongBody|null|undefined} pongBody
         * @memberof messasing.AwesomeMessage
         * @instance
         */
        AwesomeMessage.prototype.pongBody = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * AwesomeMessage body.
         * @member {"pingBody"|"pongBody"|undefined} body
         * @memberof messasing.AwesomeMessage
         * @instance
         */
        Object.defineProperty(AwesomeMessage.prototype, "body", {
            get: $util.oneOfGetter($oneOfFields = ["pingBody", "pongBody"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new AwesomeMessage instance using the specified properties.
         * @function create
         * @memberof messasing.AwesomeMessage
         * @static
         * @param {messasing.IAwesomeMessage=} [properties] Properties to set
         * @returns {messasing.AwesomeMessage} AwesomeMessage instance
         */
        AwesomeMessage.create = function create(properties) {
            return new AwesomeMessage(properties);
        };

        /**
         * Encodes the specified AwesomeMessage message. Does not implicitly {@link messasing.AwesomeMessage.verify|verify} messages.
         * @function encode
         * @memberof messasing.AwesomeMessage
         * @static
         * @param {messasing.IAwesomeMessage} message AwesomeMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AwesomeMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && message.hasOwnProperty("type"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
            if (message.id != null && message.hasOwnProperty("id"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.id);
            if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.createdAt);
            if (message.extra != null && message.hasOwnProperty("extra"))
                for (var keys = Object.keys(message.extra), i = 0; i < keys.length; ++i) {
                    writer.uint32(/* id 4, wireType 2 =*/34).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                    $root.google.protobuf.Any.encode(message.extra[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                }
            if (message.pingBody != null && message.hasOwnProperty("pingBody"))
                $root.messasing.PingBody.encode(message.pingBody, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.pongBody != null && message.hasOwnProperty("pongBody"))
                $root.messasing.PongBody.encode(message.pongBody, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified AwesomeMessage message, length delimited. Does not implicitly {@link messasing.AwesomeMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof messasing.AwesomeMessage
         * @static
         * @param {messasing.IAwesomeMessage} message AwesomeMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AwesomeMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AwesomeMessage message from the specified reader or buffer.
         * @function decode
         * @memberof messasing.AwesomeMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {messasing.AwesomeMessage} AwesomeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AwesomeMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.messasing.AwesomeMessage(), key;
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.type = reader.int32();
                    break;
                case 2:
                    message.id = reader.int64();
                    break;
                case 3:
                    message.createdAt = reader.int64();
                    break;
                case 4:
                    reader.skip().pos++;
                    if (message.extra === $util.emptyObject)
                        message.extra = {};
                    key = reader.string();
                    reader.pos++;
                    message.extra[key] = $root.google.protobuf.Any.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.pingBody = $root.messasing.PingBody.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.pongBody = $root.messasing.PongBody.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AwesomeMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof messasing.AwesomeMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {messasing.AwesomeMessage} AwesomeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AwesomeMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AwesomeMessage message.
         * @function verify
         * @memberof messasing.AwesomeMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AwesomeMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.type != null && message.hasOwnProperty("type"))
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                    return "id: integer|Long expected";
            if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                if (!$util.isInteger(message.createdAt) && !(message.createdAt && $util.isInteger(message.createdAt.low) && $util.isInteger(message.createdAt.high)))
                    return "createdAt: integer|Long expected";
            if (message.extra != null && message.hasOwnProperty("extra")) {
                if (!$util.isObject(message.extra))
                    return "extra: object expected";
                var key = Object.keys(message.extra);
                for (var i = 0; i < key.length; ++i) {
                    var error = $root.google.protobuf.Any.verify(message.extra[key[i]]);
                    if (error)
                        return "extra." + error;
                }
            }
            if (message.pingBody != null && message.hasOwnProperty("pingBody")) {
                properties.body = 1;
                {
                    var error = $root.messasing.PingBody.verify(message.pingBody);
                    if (error)
                        return "pingBody." + error;
                }
            }
            if (message.pongBody != null && message.hasOwnProperty("pongBody")) {
                if (properties.body === 1)
                    return "body: multiple values";
                properties.body = 1;
                {
                    var error = $root.messasing.PongBody.verify(message.pongBody);
                    if (error)
                        return "pongBody." + error;
                }
            }
            return null;
        };

        /**
         * Creates an AwesomeMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof messasing.AwesomeMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {messasing.AwesomeMessage} AwesomeMessage
         */
        AwesomeMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.messasing.AwesomeMessage)
                return object;
            var message = new $root.messasing.AwesomeMessage();
            switch (object.type) {
            case "PING":
            case 0:
                message.type = 0;
                break;
            case "PONG":
            case 1:
                message.type = 1;
                break;
            }
            if (object.id != null)
                if ($util.Long)
                    (message.id = $util.Long.fromValue(object.id)).unsigned = false;
                else if (typeof object.id === "string")
                    message.id = parseInt(object.id, 10);
                else if (typeof object.id === "number")
                    message.id = object.id;
                else if (typeof object.id === "object")
                    message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber();
            if (object.createdAt != null)
                if ($util.Long)
                    (message.createdAt = $util.Long.fromValue(object.createdAt)).unsigned = false;
                else if (typeof object.createdAt === "string")
                    message.createdAt = parseInt(object.createdAt, 10);
                else if (typeof object.createdAt === "number")
                    message.createdAt = object.createdAt;
                else if (typeof object.createdAt === "object")
                    message.createdAt = new $util.LongBits(object.createdAt.low >>> 0, object.createdAt.high >>> 0).toNumber();
            if (object.extra) {
                if (typeof object.extra !== "object")
                    throw TypeError(".messasing.AwesomeMessage.extra: object expected");
                message.extra = {};
                for (var keys = Object.keys(object.extra), i = 0; i < keys.length; ++i) {
                    if (typeof object.extra[keys[i]] !== "object")
                        throw TypeError(".messasing.AwesomeMessage.extra: object expected");
                    message.extra[keys[i]] = $root.google.protobuf.Any.fromObject(object.extra[keys[i]]);
                }
            }
            if (object.pingBody != null) {
                if (typeof object.pingBody !== "object")
                    throw TypeError(".messasing.AwesomeMessage.pingBody: object expected");
                message.pingBody = $root.messasing.PingBody.fromObject(object.pingBody);
            }
            if (object.pongBody != null) {
                if (typeof object.pongBody !== "object")
                    throw TypeError(".messasing.AwesomeMessage.pongBody: object expected");
                message.pongBody = $root.messasing.PongBody.fromObject(object.pongBody);
            }
            return message;
        };

        /**
         * Creates a plain object from an AwesomeMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof messasing.AwesomeMessage
         * @static
         * @param {messasing.AwesomeMessage} message AwesomeMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AwesomeMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.objects || options.defaults)
                object.extra = {};
            if (options.defaults) {
                object.type = options.enums === String ? "PING" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.id = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.createdAt = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.createdAt = options.longs === String ? "0" : 0;
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = options.enums === String ? $root.messasing.MSG_TYPE[message.type] : message.type;
            if (message.id != null && message.hasOwnProperty("id"))
                if (typeof message.id === "number")
                    object.id = options.longs === String ? String(message.id) : message.id;
                else
                    object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber() : message.id;
            if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                if (typeof message.createdAt === "number")
                    object.createdAt = options.longs === String ? String(message.createdAt) : message.createdAt;
                else
                    object.createdAt = options.longs === String ? $util.Long.prototype.toString.call(message.createdAt) : options.longs === Number ? new $util.LongBits(message.createdAt.low >>> 0, message.createdAt.high >>> 0).toNumber() : message.createdAt;
            var keys2;
            if (message.extra && (keys2 = Object.keys(message.extra)).length) {
                object.extra = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.extra[keys2[j]] = $root.google.protobuf.Any.toObject(message.extra[keys2[j]], options);
            }
            if (message.pingBody != null && message.hasOwnProperty("pingBody")) {
                object.pingBody = $root.messasing.PingBody.toObject(message.pingBody, options);
                if (options.oneofs)
                    object.body = "pingBody";
            }
            if (message.pongBody != null && message.hasOwnProperty("pongBody")) {
                object.pongBody = $root.messasing.PongBody.toObject(message.pongBody, options);
                if (options.oneofs)
                    object.body = "pongBody";
            }
            return object;
        };

        /**
         * Converts this AwesomeMessage to JSON.
         * @function toJSON
         * @memberof messasing.AwesomeMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AwesomeMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AwesomeMessage;
    })();

    return messasing;
})();

$root.google = (function() {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    var google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        var protobuf = {};

        protobuf.Any = (function() {

            /**
             * Properties of an Any.
             * @memberof google.protobuf
             * @interface IAny
             * @property {string|null} [type_url] Any type_url
             * @property {Uint8Array|null} [value] Any value
             */

            /**
             * Constructs a new Any.
             * @memberof google.protobuf
             * @classdesc Represents an Any.
             * @implements IAny
             * @constructor
             * @param {google.protobuf.IAny=} [properties] Properties to set
             */
            function Any(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Any type_url.
             * @member {string} type_url
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.type_url = "";

            /**
             * Any value.
             * @member {Uint8Array} value
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.value = $util.newBuffer([]);

            /**
             * Creates a new Any instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny=} [properties] Properties to set
             * @returns {google.protobuf.Any} Any instance
             */
            Any.create = function create(properties) {
                return new Any(properties);
            };

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.type_url);
                if (message.value != null && message.hasOwnProperty("value"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
                return writer;
            };

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Any();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.type_url = reader.string();
                        break;
                    case 2:
                        message.value = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Any message.
             * @function verify
             * @memberof google.protobuf.Any
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Any.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    if (!$util.isString(message.type_url))
                        return "type_url: string expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                        return "value: buffer expected";
                return null;
            };

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Any
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Any} Any
             */
            Any.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Any)
                    return object;
                var message = new $root.google.protobuf.Any();
                if (object.type_url != null)
                    message.type_url = String(object.type_url);
                if (object.value != null)
                    if (typeof object.value === "string")
                        $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                    else if (object.value.length)
                        message.value = object.value;
                return message;
            };

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.Any} message Any
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Any.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.type_url = "";
                    if (options.bytes === String)
                        object.value = "";
                    else {
                        object.value = [];
                        if (options.bytes !== Array)
                            object.value = $util.newBuffer(object.value);
                    }
                }
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    object.type_url = message.type_url;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
                return object;
            };

            /**
             * Converts this Any to JSON.
             * @function toJSON
             * @memberof google.protobuf.Any
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Any.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Any;
        })();

        return protobuf;
    })();

    return google;
})();

module.exports = $root;
