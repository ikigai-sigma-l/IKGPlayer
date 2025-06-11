export const enum CHeapError {
  REQUEST_ERROR = -(1 << 21)
}

export const enum POSIXError {
  EPERM = 1,		/* Not super-user */
  ENOENT,	/* No such file or directory */
  ESRCH,		/* No such process */
  EINTR,		/* Interrupted system call */
  EIO,	/* I/O error */
  ENXIO,		/* No such device or address */
  E2BIG,		/* Arg list too long */
  ENOEXEC,	/* Exec format error */
  EBADF,	/* Bad file number */
  ECHILD,	/* No children */
  EAGAIN,	/* No more processes */
  ENOMEM,	/* Not enough core */
  EACCES,	/* Permission denied */
  EFAULT,	/* Bad address */
  ENOTBLK,	/* Block device required */
  EBUSY,	/* Mount device busy */
  EEXIST,	/* File exists */
  EXDEV,	/* Cross-device link */
  ENODEV,	/* No such device */
  ENOTDIR,	/* Not a directory */
  EISDIR,	/* Is a directory */
  EINVAL,	/* Invalid argument */
  ENFILE,	/* Too many open files in system */
  EMFILE,	/* Too many open files */
  ENOTTY,	/* Not a typewriter */
  ETXTBSY,	/* Text file busy */
  EFBIG,	/* File too large */
  ENOSPC,	/* No space left on device */
  ESPIPE,	/* Illegal seek */
  EROFS,	/* Read only file system */
  EMLINK,	/* Too many links */
  EPIPE,	/* Broken pipe */
  EDOM,		/* Math arg out of domain of func */
  ERANGE,	/* Math result not representable */
  ENOMSG,	/* No message of desired type */
  EIDRM,	/* Identifier removed */
  ECHRNG,	/* Channel number out of range */
  EL2NSYNC,	/* Level 2 not synchronized */
  EL3HLT,	/* Level 3 halted */
  EL3RST,	/* Level 3 reset */
  ELNRNG,	/* Link number out of range */
  EUNATCH,	/* Protocol driver not attached */
  ENOCSI,	/* No CSI structure available */
  EL2HLT,	/* Level 2 halted */
  EDEADLK,	/* Deadlock condition */
  ENOLCK,	/* No record locks available */
  EBADE,	/* Invalid exchange */
  EBADR,	/* Invalid request descriptor */
  EXFULL,	/* Exchange full */
  ENOANO,	/* No anode */
  EBADRQC,	/* Invalid request code */
  EBADSLT,	/* Invalid slot */
  EDEADLOCK,	/* File locking deadlock error */
  EBFONT,	/* Bad font file fmt */
  ENOSTR,	/* Device not a stream */
  ENODATA,	/* No data (for no delay io) */
  ETIME,	/* Timer expired */
  ENOSR,	/* Out of streams resources */
  ENONET,	/* Machine is not on the network */
  ENOPKG,	/* Package not installed */
  EREMOTE,	/* The object is remote */
  ENOLINK,	/* The link has been severed */
  EADV,		/* Advertise error */
  ESRMNT,	/* Srmount error */
  ECOMM,	/* Communication error on send */
  EPROTO,	/* Protocol error */
  EMULTIHOP,	/* Multihop attempted */
  ELBIN,	/* Inode is remote (not really error) */
  EDOTDOT,	/* Cross mount point (not really error) */
  EBADMSG,	/* Trying to read unreadable message */
  EFTYPE,	/* Inappropriate file type or format */
  ENOTUNIQ,	/* Given log. name not unique */
  EBADFD,	/* f.d. invalid for this operation */
  EREMCHG,	/* Remote address changed */
  ELIBACC,	/* Can't access a needed shared lib */
  ELIBBAD,	/* Accessing a corrupted shared lib */
  ELIBSCN,	/* .lib section in a.out corrupted */
  ELIBMAX,	/* Attempting to link in too many libs */
  ELIBEXEC,	/* Attempting to exec a shared library */
  ENOSYS,	/* Function not implemented */
  ENMFILE,      /* No more files */
  ENOTEMPTY,	/* Directory not empty */
  ENAMETOOLONG,	/* File or path name too long */
  ELOOP,	/* Too many symbolic links */
  EOPNOTSUPP,	/* Operation not supported on transport endpoint */
  EPFNOSUPPORT, /* Protocol family not supported */
  ECONNRESET,  /* Connection reset by peer */
  ENOBUFS,	/* No buffer space available */
  EAFNOSUPPORT, /* Address family not supported by protocol family */
  EPROTOTYPE,	/* Protocol wrong type for socket */
  ENOTSOCK,	/* Socket operation on non-socket */
  ENOPROTOOPT,	/* Protocol not available */
  ESHUTDOWN,	/* Can't send after socket shutdown */
  ECONNREFUSED,	/* Connection refused */
  EADDRINUSE,		/* Address already in use */
  ECONNABORTED,	/* Connection aborted */
  ENETUNREACH,		/* Network is unreachable */
  ENETDOWN,		/* Network interface is not configured */
  ETIMEDOUT,		/* Connection timed out */
  EHOSTDOWN,		/* Host is down */
  EHOSTUNREACH,	/* Host is unreachable */
  EINPROGRESS,		/* Connection already in progress */
  EALREADY,		/* Socket already connected */
  EDESTADDRREQ,	/* Destination address required */
  EMSGSIZE,		/* Message too long */
  EPROTONOSUPPORT,	/* Unknown protocol */
  ESOCKTNOSUPPORT,	/* Socket type not supported */
  EADDRNOTAVAIL,	/* Address not available */
  ENETRESET,
  EISCONN,		/* Socket is already connected */
  ENOTCONN,		/* Socket is not connected */
  ETOOMANYREFS,
  EPROCLIM,
  EUSERS,
  EDQUOT,
  ESTALE,
  ENOTSUP,		/* Not supported */
  ENOMEDIUM,   /* No medium (in tape drive) */
  ENOSHARE,    /* No such host or network path */
  ECASECLASH,  /* Filename exists with different case */
  EILSEQ,
  EOVERFLOW,	/* Value too large for defined data type */
  EWOULDBLOCK = EAGAIN,	/* Operation would block */
  __ELASTERROR = 2000	/* Users can add values starting here */
}
