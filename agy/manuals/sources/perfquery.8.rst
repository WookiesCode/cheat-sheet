=========
perfquery
=========

-----------------------------------------------
query InfiniBand port counters on a single port
-----------------------------------------------

:Date: 2017-08-21
:Manual section: 8
:Manual group: Open IB Diagnostics

SYNOPSIS
========

perfquery [options] [<lid|guid> [[port(s)] [reset_mask]]]

DESCRIPTION
===========

perfquery uses PerfMgt GMPs to obtain the PortCounters (basic performance and
error counters), PortExtendedCounters, PortXmitDataSL, PortRcvDataSL,
PortRcvErrorDetails, PortXmitDiscardDetails, PortExtendedSpeedsCounters, or
PortSamplesControl from the PMA at the node/port specified. Optionally shows
aggregated counters for all ports of node.  Finally it can, reset after read,
or just reset the counters.

Note: In PortCounters, PortCountersExtended, PortXmitDataSL, and PortRcvDataSL,
components that represent Data (e.g. PortXmitData and PortRcvData) indicate
octets divided by 4 rather than just octets.

Note: Inputting a port of 255 indicates an operation be performed on all ports.

Note: For PortCounters, ExtendedCounters, and resets, multiple ports can be
specified by either a comma separated list or a port range.  See examples below.


OPTIONS
=======

**-x, --extended**
	show extended port counters rather than (basic) port counters.
	Note that extended port counters attribute is optional.

**-X, --xmtsl**
	show transmit data SL counter. This is an optional counter for QoS.

**-S, --rcvsl**
	show receive data SL counter. This is an optional counter for QoS.

**-D, --xmtdisc**
	show transmit discard details. This is an optional counter.

**-E, --rcverr**
	show receive error details. This is an optional counter.

**-D, --xmtdisc**
	show transmit discard details. This is an optional counter.

**-T, --extended_speeds**
	show extended speeds port counters. This is an optional counter.

**--oprcvcounters**
	show Rcv Counters per Op code. This is an optional counter.

**--flowctlcounters**
	show flow control counters. This is an optional counter.

**--vloppackets**
	show packets received per Op code per VL. This is an optional counter.

**--vlopdata**
	show data received per Op code per VL. This is an optional counter.

**--vlxmitflowctlerrors**
	show flow control update errors per VL. This is an optional counter.

**--vlxmitcounters**
	show ticks waiting to transmit counters per VL. This is an optional counter.

**--swportvlcong**
	show sw port VL congestion. This is an optional counter.

**--rcvcc**
	show Rcv congestion control counters. This is an optional counter.

**--slrcvfecn**
	show SL Rcv FECN counters. This is an optional counter.

**--slrcvbecn**
	show SL Rcv BECN counters. This is an optional counter.

**--xmitcc**
	show Xmit congestion control counters. This is an optional counter.

**--vlxmittimecc**
	show VL Xmit Time congestion control counters. This is an optional counter.

**-c, --smplctl**
	show port samples control.

**-a, --all_ports**
	show aggregated counters for all ports of the destination lid, reset
	all counters for all ports, or if multiple ports are specified, aggregate
	the counters of the specified ports.  If the destination lid does not support
	the AllPortSelect flag, all ports will be iterated through to emulate
	AllPortSelect behavior.

**-l, --loop_ports**
	If all ports are selected by the user (either through the **-a** option
	or port 255) or multiple ports are specified iterate through each port rather
	than doing than aggregate operation.

**-r, --reset_after_read**
	reset counters after read

**-R, --Reset_only**
	only reset counters


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


.. Define the common option -y

**-y, --m_key <key>**
        use the specified M_key for requests. If non-numeric value (like 'x')
        is specified then a value will be prompted for.


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

	perfquery                # read local port performance counters
	perfquery 32 1           # read performance counters from lid 32, port 1
	perfquery -x 32 1        # read extended performance counters from lid 32, port 1
	perfquery -a 32          # read perf counters from lid 32, all ports
	perfquery -r 32 1        # read performance counters and reset
	perfquery -x -r 32 1     # read extended performance counters and reset
	perfquery -R 0x20 1      # reset performance counters of port 1 only
	perfquery -x -R 0x20 1   # reset extended performance counters of port 1 only
	perfquery -R -a 32       # reset performance counters of all ports
	perfquery -R 32 2 0x0fff # reset only error counters of port 2
	perfquery -R 32 2 0xf000 # reset only non-error counters of port 2
	perfquery -a 32 1-10     # read performance counters from lid 32, port 1-10, aggregate output
	perfquery -l 32 1-10     # read performance counters from lid 32, port 1-10, output each port
	perfquery -a 32 1,4,8    # read performance counters from lid 32, port 1, 4, and 8, aggregate output
	perfquery -l 32 1,4,8    # read performance counters from lid 32, port 1, 4, and 8, output each port

AUTHOR
======

Hal Rosenstock
	< hal.rosenstock@gmail.com >
