import { HardenedAny } from '../wrap_any';

import colors from 'colors/safe';

// Logging is one place where HardenedAny is needed! The intent was object dumping code, down to
// every leaf, in a hardened way. A testground for DRY logging in ts.
// Closures are good for logging, localising to particular files/functions/lines, and returning a continuation.

export const fix = <T>(x: T) => x;

//These are functions string => string
export const successCol = colors.green;
export const warningCol = colors.yellow;
export const errorCol = colors.red;

interface CleanError {
  name: string;
  message: string;
  stack: string;
}

export type LogEventRenderer = (maps: CleanError) => string;

export type ColFun = (maps: string) => string;

export const sep = ': ';

export const baseErrorMsg = '';
export const undefinedVariableMsg =
  baseErrorMsg + 'Attempted to log an undefined variable.' + sep;
export const nullVariableMsg =
  baseErrorMsg + 'Attempted to log a null variable.' + sep;
export const unknownLineAndFileMsg =
  baseErrorMsg + 'Unknown line and file' + sep;
export const cantOpenErrorMsg =
  baseErrorMsg + 'Cant access stack info from Error()' + sep;

export const fileLineRenderer = (e: CleanError) => {
  const regex = /\((.*):(\d+):(\d+)\)$/;
  const match = regex.exec(e.stack);

  return match
    ? match[1] + sep + match[2] + sep + match[3]
    : unknownLineAndFileMsg + sep + e.stack;
};

export const stackRenderer = (e: CleanError) => e.stack;

export type LoggerFun = (maps: string) => void;
export const simpleLogger = (msg: string) => console.log(msg);
export const dateLogger = (msg: string) => simpleLogger(Date() + sep + msg);

//export type MonadicType<T> = (maps: T) => MonadicType<T>
// This apparently simple operation, logging, has a fairly rich monadic structure.
// FIXME: TYPEME: return type. It seems to be a recursive union.
export const logContextInfoGen =
  <RetType>(retObj: RetType) =>
  (msgRenderer: LogEventRenderer) =>
  (col: ColFun) =>
  (logger: LoggerFun) =>
  (toBeLogged: HardenedAny): RetType => {
    if (toBeLogged === undefined)
      return logContextInfoGen(retObj)(stackRenderer)(warningCol)(logger)(
        undefinedVariableMsg
      );

    if (toBeLogged === null)
      return logContextInfoGen(retObj)(stackRenderer)(warningCol)(logger)(
        nullVariableMsg
      );
    var cleanMessage: string;

    if (typeof toBeLogged === 'string') {
      cleanMessage = col(toBeLogged);
    } else {
      // Strip anything else down to its source code, so we know what is being sent to us.
      // and print it plain, nothing is worse than red source code ...
      cleanMessage = toBeLogged.toString();
    }
    const e = new Error();
    if (!e.stack) {
      logger(errorCol(cantOpenErrorMsg) + cleanMessage);
    } else {
      const ce = e as CleanError;
      const info = msgRenderer(ce);
      logger(info + sep + cleanMessage);
    }
    return retObj;
  };

const logContextInfo =
  <RetType>(retObj: RetType) =>
  (col: ColFun) =>
  (logger: LoggerFun) =>
  (a: HardenedAny): RetType =>
    logContextInfoGen(retObj)(fileLineRenderer)(col)(logger)(a);

export class logclos {
  sep: string = sep;
  depth: number = -1;

  logger() {
    this.depth = this.depth++;
    return this.depth ? simpleLogger : dateLogger;
  }

  warning(a: HardenedAny): this {
    return logContextInfo(this)(warningCol)(this.logger())(a);
  }
  error(a: HardenedAny): this {
    return logContextInfo(this)(errorCol)(this.logger())(a);
  }
  success(a: HardenedAny): this {
    return logContextInfo(this)(successCol)(this.logger())(a);
  }
  trace(a: HardenedAny): this {
    return logContextInfoGen(this)(stackRenderer)(fix)(this.logger())(a);
  }
  info(a: HardenedAny): this {
    return logContextInfoGen(this)(fileLineRenderer)(fix)(this.logger())(a);
  }
  reportSecurityIncident(a: HardenedAny): this {
    return logContextInfo(this)(errorCol)(this.logger())(a);
  }
}
