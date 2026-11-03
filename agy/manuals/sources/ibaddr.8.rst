======
IBADDR
======

----------------------------
query InfiniBand address(es)
----------------------------

:Date: 2013-10-11
:Manual section: 8
:Manual group: OpenIB Diagnostics


SYNOPSIS
========

ibaddr [options]


DESCRIPTION
===========


Display the lid (and range) as well as the GID address of the
port specified (by DR path, lid, or GUID) or the local port by default.

Note: this utility can be used as simple address resolver.

OPTIONS
=======

**--gid_show, -g**
show gid address only

**--lid_show, -l**
show lid range only

**--Lid_show, -L**
show lid range (in decimal) only


Addressing Flags
----------------

.. Define the common option -D for Directed routes

**-D, --Direct**     The address specified is a directed route
::

    Examples:
       [options] -D [options] "0"          # self port
       [options] -D [options] "0,1,2,1,4"  # out via port 1, then 2, ...

       (Note the second number in the path specified must match the port being
       used.  This can be specified using the port selection flag '-P' or the
       port found through the automatic selection process.)



.. Define the common option -G

**-G, --Guid**     The address specified is a Port GUID


.. Define the common option -s

**-s, --sm_port <smlid>**     use 'smlid' as the target lid for SA queries.


Debugging flags
---------------

.. Define the common option -d

-d
        raise the IB debugging level.
        May be used several times (-ddd or -d -d -d).


.. Define the common option -e

-e      show send and receive errors (timeouts and others)

.. Define the common option -h

**-h, --help**      show the usage message


.. Define the common option -v

**-v, --verbose**
        increase the application verbosity level.
        May be used several times (-vv or -v -v -v)


.. Define the common option -V

**-V, --version**     show the version info.


Port Selection flags
--------------------

.. Define the common option -C

**-C, --Ca <ca_name>**    use the specified ca_name.


.. Define the common option -P

**-P, --Port <ca_port>**    use the specified ca_port.


.. Define the common option -Y

**-Y, --pkey-idx <idx>**
  P_Key table index (0-65535, default 0) used for the outgoing SA/GMP MADs.
  SMP (SMI directed-route/LID-routed) MADs always use P_Key index 0.

.. Explanation of local port selection

Local port Selection
--------------------

Multiple port/Multiple CA support: when no IB device or port is specified
(see the "local umad parameters" below), the libibumad library
selects the port to use by the following criteria:

	1. the first port that is ACTIVE.
	2. if not found, the first port that is UP (physical link up).

	If a port and/or CA name is specified, the libibumad library attempts
	to fulfill the user request, and will fail if it is not possible.

	For example:

        ::

	    ibaddr                 # use the first port (criteria #1 above)
	    ibaddr -C mthca1       # pick the best port from "mthca1" only.
	    ibaddr -P 2            # use the second (active/up) port from the first available IB device.
	    ibaddr -C mthca0 -P 2  # use the specified port only.


Configuration flags
-------------------

.. Define the common option -y

**-y, --m_key <key>**
        use the specified M_key for requests. If non-numeric value (like 'x')
        is specified then a value will be prompted for.


.. Define the common option -t

**-t, --timeout <timeout_ms>** override the default timeout for the solicited mads.


.. Define the common option -z

**--config, -z  <config_file>** Specify alternate config file.

        Default: @IBDIAG_CONFIG_PATH@/ibdiag.conf


FILES
=====

.. Common text for the config file

CONFIG FILE
-----------

@IBDIAG_CONFIG_PATH@/ibdiag.conf

A global config file is provided to set some of the common options for all
tools.  See supplied config file for details.


EXAMPLES
========

::

        ibaddr                  # local port\'s address
        ibaddr 32               # show lid range and gid of lid 32
        ibaddr -G 0x8f1040023   # same but using guid address
        ibaddr -l 32            # show lid range only
        ibaddr -L 32            # show decimal lid range only
        ibaddr -g 32            # show gid address only

SEE ALSO
========

**ibroute (8), ibtracert (8)**

AUTHOR
======

Hal Rosenstock
        < halr@voltaire.com >
