---
title: Breaking Down the Syslog Protocol
date_created: 2023-07-07
date_updated: 2023-07-08
metadata: research
tags: 
---
# Breaking Down the Syslog Protocol

The Syslog protocol is used for the transmission of event notification messages across networks as initially described in RFC 3164. It has since been deprecated in favor of the newer version defined in RFC 5424. 

While working with several systems in the past, I've seen several systems refer to an event format as Syslog-compatible but fail when parsed using some tools like Vector's `parse_syslog`.

This led me to this unnecessary exploration of the Syslog protocol through its white papers.

**The networking-side of Syslog**

Syslog generally sends over TCP connections. This means we're operating at a much simpler compared to say, a web socket that transmits over HTTP/S. This means we have much less to work with compared to web sockets.

- 514 UDP 
- 6514 TCP - TLS-enabled 

## RFC 5424

The focus of this post will focus primarily on this RFC as the previous one has been deprecated so theoretically this should be the more supported version. 

The most important part of the RFC is section "6. Syslog Message Format" as it thoroughly explains the required format for compatibility. I've been googling for what a syslog formatted message would look like but it varies from article to article.

**The ABNF (Augmented Backus-Naur Form) definition**

The RFC describes the format using the Augmented Backus-Naur Form which is, based on cursory searching, a way to create a specification for communication.

Going through the ABNF would be a waste of everyone's time so here's a short snippet showing the highest-level definition.

```
SYSLOG-MSG      = HEADER SP STRUCTURED-DATA [SP MSG]

HEADER          = PRI VERSION SP TIMESTAMP SP HOSTNAME
				SP APP-NAME SP PROCID SP MSGID
...
SP              = %d32
```

> `SYSLOG-MSG      = HEADER SP STRUCTURED-DATA [SP MSG]`

The syslog message is defined as the `HEADER` element, then the `SP` element, then the `STRUCTURED-DATA` element and an optional `SP` and `MSG` after that. Note that the `SP` element is defined to be `ASCII %d32` at the end of the notation and translates to `SPACE`. 

That means that we can have a valid syslog message with just the `HEADER` and `STRUCTURED-DATA` elements as shown below.

```
<123>1 2023-01-01T12:02:01Z - - - - -
```

### The HEADER element

```
HEADER          = PRI VERSION SP TIMESTAMP SP HOSTNAME
				SP APP-NAME SP PROCID SP MSGID
PRI             = "<" PRIVAL ">"
PRIVAL          = 1*3DIGIT ; range 0 .. 191
VERSION         = NONZERO-DIGIT 0*2DIGIT
HOSTNAME        = NILVALUE / 1*255PRINTUSASCII

APP-NAME        = NILVALUE / 1*48PRINTUSASCII
PROCID          = NILVALUE / 1*128PRINTUSASCII
MSGID           = NILVALUE / 1*32PRINTUSASCII

TIMESTAMP       = NILVALUE / FULL-DATE "T" FULL-TIME
FULL-DATE       = DATE-FULLYEAR "-" DATE-MONTH "-" DATE-MDAY
DATE-FULLYEAR   = 4DIGIT
DATE-MONTH      = 2DIGIT  ; 01-12
DATE-MDAY       = 2DIGIT  ; 01-28, 01-29, 01-30, 01-31 based on
						; month/year
FULL-TIME       = PARTIAL-TIME TIME-OFFSET
PARTIAL-TIME    = TIME-HOUR ":" TIME-MINUTE ":" TIME-SECOND
				[TIME-SECFRAC]
TIME-HOUR       = 2DIGIT  ; 00-23
TIME-MINUTE     = 2DIGIT  ; 00-59
TIME-SECOND     = 2DIGIT  ; 00-59
TIME-SECFRAC    = "." 1*6DIGIT
TIME-OFFSET     = "Z" / TIME-NUMOFFSET
TIME-NUMOFFSET  = ("+" / "-") TIME-HOUR ":" TIME-MINUTE

...

NILVALUE        = "-"
NONZERO-DIGIT   = %d49-57
```

The header element has the priority, version, timestamp, hostname, app-name, process ID, and message ID in it. 

> `PRI             = "<" PRIVAL ">"`
> `PRIVAL          = 1*3DIGIT ; range 0 .. 191`
> `VERSION         = NONZERO-DIGIT 0*2DIGIT`

The `PRI` element is defined to be an open bracket, any number from 0 to 191 then a close bracket and is a required element of the message. The `VERSION` element, on the other hand, is a `NONZERO-DIGIT` element followed by "zero to two" `DIGIT` elements where `NONZERO-DIGIT` is `ASCII d49-d57` or "1-9" and a `DIGIT` is a `NONZERO-DIGIT` or `ASCII d48` or "0".

> `HOSTNAME        = NILVALUE / 1*255PRINTUSASCII`

Since the succeeding elements are somewhat similar, let's just refer to the `HOSTNAME` elements for explaining this. The element is either a `NILVALUE` (the dash symbol "-") or "1 to 255" instances of the `PRINTUSASCII` element or `ASCII %d33-126`. The same pattern applies for `APP-NAME`, `PROCID`, and `MSGID`.

The timestamp section is huge and simply put it is the syntax below with optional fractional seconds and mandatory timezone or offset specification where `Z` indicates that it's `GMT`.

```
YYYY-MM-DDTHH-MM-SS.000000Z
```

### The STRUCTURED-DATA element

```
STRUCTURED-DATA = NILVALUE / 1*SD-ELEMENT
SD-ELEMENT      = "[" SD-ID *(SP SD-PARAM) "]"
SD-PARAM        = PARAM-NAME "=" %d34 PARAM-VALUE %d34
SD-ID           = SD-NAME
PARAM-NAME      = SD-NAME
PARAM-VALUE     = UTF-8-STRING ; characters '"', '\' and
							 ; ']' MUST be escaped.
SD-NAME         = 1*32PRINTUSASCII
				; except '=', SP, ']', %d34 (")
```

Firstly, the `STRUCTURED-DATA` element is required but can be replaced with a `NILVALUE` or "-".  Otherwise it can be "one or more" `SD-ELEMENT` elements.

> `SD-ELEMENT      = "[" SD-ID *(SP SD-PARAM) "]"
> `SD-PARAM        = PARAM-NAME "=" %d34 PARAM-VALUE %d34`

The `SD-ELEMENT` element is an open bracket, `SD-ID` element, and any number of `SD-PARAM` separated by an `SP` element. This would look something like the snippet shown below which is a single element and then any number of key=value pairs with some limitations on the characters that can be used for the different elements.

```
[structured_data_name key="value"]
```

### The MSG element

```
MSG             = MSG-ANY / MSG-UTF8
MSG-ANY         = *OCTET ; not starting with BOM
MSG-UTF8        = BOM UTF-8-STRING
BOM             = %xEF.BB.BF
UTF-8-STRING    = *OCTET ; UTF-8 string as specified
				; in RFC 3629
```

The `MSG` element can be any number of `OCTET` characters or, when the byte-order mark (BOM) `%xEF.BB.BF` is specified, a `UTF-8` string.

## Conclusion

From all this reading, we can confidently specify the minimum Syslog-compliant message content. The data section is technically optional but a syslog message without data would not be as useful but that may depend on the use case. 

```
<123>1 2023-01-01T12:02:01Z - - - - - DATA
```
