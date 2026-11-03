=========
ibsysstat
=========

--------------------------------------
system status on an InfiniBand address
--------------------------------------

:Date: 2017-08-21
:Manual section: 8
:Manual group: Open IB Diagnostics

SYNOPSIS
========

ibsysstat [options] <dest lid | guid> [<op>]

DESCRIPTION
===========

ibsysstat uses vendor mads to validate connectivity between IB nodes
and obtain other information about the IB node. ibsysstat is run as
client/server. Default is to run as client.

OPTIONS
=======

Current supported operations:

::

        ping \- verify connectivity to server (default)
        host \- obtain host information from server
        cpu  \- obtain cpu information from server

**-o, --oui**
        use specified OUI number to multiplex vendor mads

**-S, --Server**
        start in server mode (do not return)


Addressing Flags
----------------

.. Define the common option -G

**-G, --Guid**     The address specified is a Port GUID


.. Define the common option -L

**-L, --Lid**   The address specified is a LID


.. Define the common option -s

**-s, --sm_port <smlid>**     use 'smlid' as the target lid for SA queries.


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


Configuration flags
-------------------

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


AUTHOR
======

Hal Rosenstock
        < halr@voltaire.com >
