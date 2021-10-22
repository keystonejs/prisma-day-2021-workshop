import { HardenedAny } from '../wrap_any';

import colors from 'colors/safe';
import ErrorStackParser from 'error-stack-parser';

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

export type LoggerFun = (maps: string) => void;
export const simpleLogger = (msg: string) => console.log(msg);
export const dateRenderer = (msg: string): string => {
  return Date() + sep + msg;
};

export const fileLineRenderer = (e: CleanError) => {
  const stackFrames = ErrorStackParser.parse(e);
  const elem = stackFrames[0];

  const scope =
    elem.functionName === undefined ? 'file scope' : elem.functionName;
  return dateRenderer(
    elem.fileName +
      sep +
      scope +
      sep +
      elem.lineNumber +
      sep +
      elem.columnNumber
  );
};

export const abbreviatedRenderer = (e: CleanError): string => {
  return '';
};

export const stackRenderer = (e: CleanError): string => {
  let str: string = '';

  ErrorStackParser.parse(e)?.map((elem: ErrorStackParser.StackFrame) => {
    const scope =
      elem.functionName === undefined ? 'file scope' : elem.functionName;

    str =
      str +
      '\n' +
      elem?.fileName +
      sep +
      scope +
      sep +
      elem?.lineNumber +
      sep +
      elem?.columnNumber;
  });
  return dateRenderer(str);
};

export const cleanStackRenderer = (cleanMessage: string) => (e: Error) => {
  if (!e.stack) {
    dateRenderer(errorCol(cantOpenErrorMsg) + cleanMessage);
  } else {
    const ce = e as CleanError;
    const info = stackRenderer(ce);
    dateRenderer(info + sep + cleanMessage);
  }
};

//export type MonadicType<T> = (maps: T) => MonadicType<T>
// This apparently simple operation, logging, has a fairly rich monadic structure.
// FIXME: TYPEME: return type. It seems to be a recursive union.
export const logContextInfoGen =
  <TretObj>(retObj: TretObj) =>
  (logger: LoggerFun) =>
  (col: ColFun) =>
  (msgRenderer: LogEventRenderer) =>
  (toBeLogged: HardenedAny): TretObj => {
    if (toBeLogged === undefined)
      return logContextInfoGen(retObj)(logger)(warningCol)(stackRenderer)(
        undefinedVariableMsg
      );

    if (toBeLogged === null)
      return logContextInfoGen(retObj)(logger)(warningCol)(stackRenderer)(
        nullVariableMsg
      );
    let cleanMessage: string;

    if (typeof toBeLogged === 'string') {
      cleanMessage = col(toBeLogged);
    } else {
      // Strip anything else down to its source code, so we know what is being sent to us.
      // and print it plain, nothing is worse than red source code ...
      cleanMessage = JSON.stringify(toBeLogged, null, 3);
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
  <TretObj>(retObj: TretObj) =>
  (col: ColFun) =>
  (msgRenderer: LogEventRenderer) =>
  (a: HardenedAny): TretObj =>
    logContextInfoGen(retObj)(simpleLogger)(col)(msgRenderer)(a);

export class logclos {
  depth = -1;

  renderer() {
    this.depth = this.depth + 1;
    return this.depth ? abbreviatedRenderer : fileLineRenderer;
  }

  warning(a: HardenedAny): this {
    return logContextInfo(this)(warningCol)(this.renderer())(a);
  }
  error(a: HardenedAny): this {
    return logContextInfo(this)(errorCol)(this.renderer())(a);
  }
  success(a: HardenedAny): this {
    return logContextInfo(this)(successCol)(this.renderer())(a);
  }
  trace(a: HardenedAny): this {
    return logContextInfoGen(this)(simpleLogger)(fix)(stackRenderer)(a);
  }
  info(a: HardenedAny): this {
    return logContextInfoGen(this)(simpleLogger)(fix)(this.renderer())(a);
  }
  reportSecurityIncident(a: HardenedAny): this {
    return logContextInfo(this)(errorCol)(this.renderer())(a);
  }
}
/* eslint no-unused-vars: "off" */
export class xlogclos {
  warning(a: HardenedAny): this {
    return this;
  }
  error(a: HardenedAny): this {
    return this;
  }
  success(a: HardenedAny): this {
    return this;
  }
  trace(a: HardenedAny): this {
    return this;
  }
  info(a: HardenedAny): this {
    return this;
  }
  reportSecurityIncident(a: HardenedAny): this {
    return this;
  }
}
/* eslint no-unused-vars: "error" */

export const log = () => new logclos();
export const xlog = () => new xlogclos();
