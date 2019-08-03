import * as $protobuf from "protobufjs";
/** Namespace messasing. */
export namespace messasing {

    /** Properties of a PingBody. */
    interface IPingBody {

        /** PingBody nounce */
        nounce?: (number|null);
    }

    /** Represents a PingBody. */
    class PingBody implements IPingBody {

        /**
         * Constructs a new PingBody.
         * @param [properties] Properties to set
         */
        constructor(properties?: messasing.IPingBody);

        /** PingBody nounce. */
        public nounce: number;

        /**
         * Creates a new PingBody instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PingBody instance
         */
        public static create(properties?: messasing.IPingBody): messasing.PingBody;

        /**
         * Encodes the specified PingBody message. Does not implicitly {@link messasing.PingBody.verify|verify} messages.
         * @param message PingBody message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: messasing.IPingBody, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PingBody message, length delimited. Does not implicitly {@link messasing.PingBody.verify|verify} messages.
         * @param message PingBody message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: messasing.IPingBody, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PingBody message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PingBody
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): messasing.PingBody;

        /**
         * Decodes a PingBody message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PingBody
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): messasing.PingBody;

        /**
         * Verifies a PingBody message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PingBody message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PingBody
         */
        public static fromObject(object: { [k: string]: any }): messasing.PingBody;

        /**
         * Creates a plain object from a PingBody message. Also converts values to other types if specified.
         * @param message PingBody
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: messasing.PingBody, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PingBody to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PongBody. */
    interface IPongBody {

        /** PongBody reply */
        reply?: (number|null);
    }

    /** Represents a PongBody. */
    class PongBody implements IPongBody {

        /**
         * Constructs a new PongBody.
         * @param [properties] Properties to set
         */
        constructor(properties?: messasing.IPongBody);

        /** PongBody reply. */
        public reply: number;

        /**
         * Creates a new PongBody instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PongBody instance
         */
        public static create(properties?: messasing.IPongBody): messasing.PongBody;

        /**
         * Encodes the specified PongBody message. Does not implicitly {@link messasing.PongBody.verify|verify} messages.
         * @param message PongBody message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: messasing.IPongBody, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PongBody message, length delimited. Does not implicitly {@link messasing.PongBody.verify|verify} messages.
         * @param message PongBody message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: messasing.IPongBody, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PongBody message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PongBody
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): messasing.PongBody;

        /**
         * Decodes a PongBody message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PongBody
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): messasing.PongBody;

        /**
         * Verifies a PongBody message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PongBody message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PongBody
         */
        public static fromObject(object: { [k: string]: any }): messasing.PongBody;

        /**
         * Creates a plain object from a PongBody message. Also converts values to other types if specified.
         * @param message PongBody
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: messasing.PongBody, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PongBody to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** MSG_TYPE enum. */
    enum MSG_TYPE {
        PING = 0,
        PONG = 1
    }

    /** Properties of an AwesomeMessage. */
    interface IAwesomeMessage {

        /** AwesomeMessage type */
        type?: (messasing.MSG_TYPE|null);

        /** AwesomeMessage id */
        id?: (number|Long|null);

        /** AwesomeMessage createdAt */
        createdAt?: (number|Long|null);

        /** AwesomeMessage extra */
        extra?: ({ [k: string]: google.protobuf.IAny }|null);

        /** AwesomeMessage pingBody */
        pingBody?: (messasing.IPingBody|null);

        /** AwesomeMessage pongBody */
        pongBody?: (messasing.IPongBody|null);
    }

    /** Represents an AwesomeMessage. */
    class AwesomeMessage implements IAwesomeMessage {

        /**
         * Constructs a new AwesomeMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: messasing.IAwesomeMessage);

        /** AwesomeMessage type. */
        public type: messasing.MSG_TYPE;

        /** AwesomeMessage id. */
        public id: (number|Long);

        /** AwesomeMessage createdAt. */
        public createdAt: (number|Long);

        /** AwesomeMessage extra. */
        public extra: { [k: string]: google.protobuf.IAny };

        /** AwesomeMessage pingBody. */
        public pingBody?: (messasing.IPingBody|null);

        /** AwesomeMessage pongBody. */
        public pongBody?: (messasing.IPongBody|null);

        /** AwesomeMessage body. */
        public body?: ("pingBody"|"pongBody");

        /**
         * Creates a new AwesomeMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AwesomeMessage instance
         */
        public static create(properties?: messasing.IAwesomeMessage): messasing.AwesomeMessage;

        /**
         * Encodes the specified AwesomeMessage message. Does not implicitly {@link messasing.AwesomeMessage.verify|verify} messages.
         * @param message AwesomeMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: messasing.IAwesomeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AwesomeMessage message, length delimited. Does not implicitly {@link messasing.AwesomeMessage.verify|verify} messages.
         * @param message AwesomeMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: messasing.IAwesomeMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AwesomeMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AwesomeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): messasing.AwesomeMessage;

        /**
         * Decodes an AwesomeMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AwesomeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): messasing.AwesomeMessage;

        /**
         * Verifies an AwesomeMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AwesomeMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AwesomeMessage
         */
        public static fromObject(object: { [k: string]: any }): messasing.AwesomeMessage;

        /**
         * Creates a plain object from an AwesomeMessage message. Also converts values to other types if specified.
         * @param message AwesomeMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: messasing.AwesomeMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AwesomeMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of an Any. */
        interface IAny {

            /** Any type_url */
            type_url?: (string|null);

            /** Any value */
            value?: (Uint8Array|null);
        }

        /** Represents an Any. */
        class Any implements IAny {

            /**
             * Constructs a new Any.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IAny);

            /** Any type_url. */
            public type_url: string;

            /** Any value. */
            public value: Uint8Array;

            /**
             * Creates a new Any instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Any instance
             */
            public static create(properties?: google.protobuf.IAny): google.protobuf.Any;

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Any;

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Any;

            /**
             * Verifies an Any message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Any
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Any;

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @param message Any
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Any, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Any to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}
